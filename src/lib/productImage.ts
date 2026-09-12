import { useSyncExternalStore } from 'react';
import type { Product } from '@/types';
import { BRAND_ALIASES } from '@/data/brands';

/**
 * 제품 실제 사진 찾기 (외부 소스).
 *  1) 네이버 쇼핑 검색 API — 서버 함수(/api/product-image)를 통해. 키가 없으면 501 → 이 소스는 끔.
 *  2) Open Beauty Facts — 공개 라이선스(CC BY-SA) 사용자 업로드 사진. 키 없이 바로 쓰지만
 *     검색 API 가 분당 10회로 제한돼 6.5초 간격으로 천천히 조회한다.
 * 결과는 localStorage 에 캐시(네이버 1일 · OBF 30일 · 없음 7일)한다.
 */

export type ImageSource = 'naver' | 'obf';

export interface ExternalProductImage {
  url: string;
  source: ImageSource;
  link: string;
  /** 출처 표기 문구 */
  credit: string;
}

type CacheEntry = { at: number; hit: ExternalProductImage | null };

const API_BASE = ((import.meta.env.VITE_API_BASE as string | undefined) ?? '').replace(/\/$/, '');
const CACHE_PREFIX = 'my-vanity:img:v1:';
const TTL: Record<ImageSource | 'none', number> = { naver: 24 * 3600e3, obf: 30 * 86400e3, none: 7 * 86400e3 };

const memory = new Map<string, ExternalProductImage | null>();
const listeners = new Set<() => void>();
const pending = new Set<string>();
let naverAvailable: boolean | null = null; // null = 아직 모름

const notify = () => listeners.forEach((l) => l());

function readCache(id: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + id);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    const ttl = TTL[entry.hit?.source ?? 'none'];
    return Date.now() - entry.at < ttl ? entry : null;
  } catch {
    return null;
  }
}

function writeCache(id: string, hit: ExternalProductImage | null) {
  try {
    localStorage.setItem(CACHE_PREFIX + id, JSON.stringify({ at: Date.now(), hit } satisfies CacheEntry));
  } catch {
    /* 무시 */
  }
}

// ---------------------------------------------------------------------------
//  소스 1: 네이버 쇼핑 (서버 프록시)
// ---------------------------------------------------------------------------

async function fromNaver(product: Product): Promise<ExternalProductImage | null | 'unavailable'> {
  if (naverAvailable === false) return 'unavailable';
  try {
    const res = await fetch(`${API_BASE}/api/product-image?q=${encodeURIComponent(`${product.brand} ${product.name}`)}`);
    if (res.status === 501 || res.status === 404) {
      naverAvailable = false;
      return 'unavailable';
    }
    if (!res.ok) return null;
    naverAvailable = true;
    const json = (await res.json()) as { hit: { image: string; link: string; mall: string } | null };
    if (!json.hit) return null;
    return { url: json.hit.image, source: 'naver', link: json.hit.link, credit: `네이버 쇼핑${json.hit.mall ? ` · ${json.hit.mall}` : ''}` };
  } catch {
    naverAvailable = naverAvailable ?? false;
    return naverAvailable ? null : 'unavailable';
  }
}

// ---------------------------------------------------------------------------
//  소스 2: Open Beauty Facts (분당 10회 제한 → 직렬 큐)
// ---------------------------------------------------------------------------

const OBF_INTERVAL = 6500;
let obfChain: Promise<void> = Promise.resolve();
let obfLast = 0;

function obfQuery(product: Product): string {
  const en = [...(BRAND_ALIASES[product.brand] ?? [])][0];
  const alias = product.aliases.find((a) => /^[a-z0-9 .'&+-]+$/i.test(a) && a.split(' ').length >= 2);
  if (alias) return alias;
  return `${en ?? product.brand} ${product.name}`;
}

function fromObf(product: Product): Promise<ExternalProductImage | null> {
  const run = async () => {
    const wait = Math.max(0, obfLast + OBF_INTERVAL - Date.now());
    if (wait) await new Promise((r) => setTimeout(r, wait));
    obfLast = Date.now();
    const q = obfQuery(product);
    const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,brands,code,image_front_small_url,image_front_url`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const json = (await res.json()) as { products?: { product_name?: string; brands?: string; code?: string; image_front_small_url?: string; image_front_url?: string }[] };
    const brandForms = [product.brand, ...(BRAND_ALIASES[product.brand] ?? [])].map((b) => b.toLowerCase().replace(/[^a-z0-9가-힣]/g, ''));
    const hit = (json.products ?? []).find((p) => {
      const img = p.image_front_small_url ?? p.image_front_url;
      if (!img) return false;
      const brand = (p.brands ?? '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
      const name = (p.product_name ?? '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
      return brandForms.some((b) => b && (brand.includes(b) || name.includes(b)));
    });
    if (!hit) return null;
    return {
      url: (hit.image_front_small_url ?? hit.image_front_url)!,
      source: 'obf' as const,
      link: `https://world.openbeautyfacts.org/product/${hit.code}`,
      credit: 'Open Beauty Facts · CC BY-SA',
    };
  };
  const p = obfChain.then(run, run).catch(() => null);
  obfChain = p.then(() => undefined, () => undefined);
  return p;
}

// ---------------------------------------------------------------------------
//  공개 API
// ---------------------------------------------------------------------------

/** 캐시에 있으면 즉시, 없으면 조회를 시작하고 null 을 돌려준다 (결과가 오면 구독자에게 알림) */
export function getExternalImage(product: Product): ExternalProductImage | null {
  if (product.custom) return null;
  if (memory.has(product.id)) return memory.get(product.id) ?? null;
  const cached = readCache(product.id);
  if (cached) {
    memory.set(product.id, cached.hit);
    return cached.hit;
  }
  if (!pending.has(product.id)) {
    pending.add(product.id);
    void (async () => {
      let hit: ExternalProductImage | null = null;
      const naver = await fromNaver(product);
      if (naver !== 'unavailable' && naver) hit = naver;
      if (!hit) hit = await fromObf(product);
      memory.set(product.id, hit);
      writeCache(product.id, hit);
      pending.delete(product.id);
      notify();
    })();
  }
  return null;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** React 훅 — 외부 사진이 도착하면 다시 렌더링된다 */
export function useExternalImage(product: Product | null): ExternalProductImage | null {
  return useSyncExternalStore(
    subscribe,
    () => (product ? getExternalImage(product) : null),
    () => null,
  );
}

/** 이 기기에서 네이버 쇼핑 소스를 쓸 수 있는지 (한 번이라도 성공하면 true) */
export const isNaverImageAvailable = () => naverAvailable === true;
