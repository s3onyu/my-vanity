import type {
  BoardPost,
  ConcernId,
  MatchType,
  PostReport,
  Product,
  ProductCategory,
  Profile,
  ProductMatch,
  ProductPrice,
  ReportReason,
  RoutineFrequency,
  RoutineItem,
  RoutineType,
  SkinLog,
  SkinMetrics,
  SkinType,
  Verdict,
  FeedTopicId,
  FeedWeight,
} from '@/types';
import { ensureUserId, getSupabase } from '@/lib/supabase';
import {
  EMPTY_PENDING,
  SavedOnDeviceOnly,
  deviceStore,
  mergePending,
  pendingCount,
  planUpload,
  readPending,
  writePending,
  type MissingSchema,
  type PendingData,
} from './pendingSync';
import type { Repository, UserData } from './repository';

// ---------------------------------------------------------------------------
//  행(snake_case) ↔ 도메인(camelCase) 매핑
// ---------------------------------------------------------------------------

interface ProfileRow {
  user_id: string;
  skin_type: string | null;
  concerns: string[] | null;
  nickname: string | null;
  created_at: string;
  agreed_at: string | null;
  agreed_version: string | null;
  skin_code?: string | null;
  skin_code_at?: string | null;
  feed_topics?: Partial<Record<FeedTopicId, FeedWeight>> | null;
}
interface RoutineRow {
  id: string;
  routine_type: string;
  product_id: string;
  sort_order: number;
  started_at: string;
  frequency?: RoutineFrequency | null;
}

interface PriceRow {
  product_id: string;
  price: number;
  volume: number | null;
  shop: string | null;
  updated_at: string;
}
interface LogRow {
  id: string;
  date: string;
  period: string | null;
  products: string[] | null;
  comfort: number;
  dryness: number;
  oiliness: number;
  irritation: number;
  memo: string | null;
  photo_url: string | null;
  skin_metrics: SkinMetrics | null;
}
interface MatchRow {
  id: string;
  product_id: string;
  match_type: string;
  created_at: string;
}
interface CustomProductRow {
  id: string;
  brand: string;
  name: string;
  aliases: string[] | null;
  category: string;
  key_ingredients: string[] | null;
  related_concerns: string[] | null;
  skin_types: string[] | null;
  image_url: string | null;
}
interface PostRow {
  id: string;
  author_nickname: string;
  concern_category: string;
  title: string;
  body: string;
  product_name: string | null;
  verdict: string;
  image_url: string | null;
  likes: number;
  created_at: string;
}

const toProfile = (r: ProfileRow): Profile => ({
  skinType: (r.skin_type as SkinType | null) ?? null,
  concerns: (r.concerns ?? []) as ConcernId[],
  nickname: r.nickname,
  createdAt: r.created_at,
  agreedAt: r.agreed_at ?? null,
  agreedVersion: r.agreed_version ?? null,
  skinCode: r.skin_code ?? null,
  skinCodeAt: r.skin_code_at ?? null,
  feedTopics: r.feed_topics ?? null,
});
const toRoutine = (r: RoutineRow): RoutineItem => ({
  id: r.id,
  routineType: r.routine_type as RoutineType,
  productId: r.product_id,
  sortOrder: r.sort_order,
  startedAt: r.started_at,
  frequency: r.frequency ?? null,
});

const toPrice = (r: PriceRow): ProductPrice => ({
  productId: r.product_id,
  price: r.price,
  volume: r.volume,
  shop: r.shop,
  updatedAt: r.updated_at,
});
const toLog = (r: LogRow): SkinLog => ({
  id: r.id,
  date: r.date,
  period: (r.period as RoutineType) ?? 'PM',
  products: r.products ?? [],
  comfort: r.comfort,
  dryness: r.dryness,
  oiliness: r.oiliness,
  irritation: r.irritation,
  memo: r.memo ?? '',
  photoUrl: r.photo_url,
  skinMetrics: r.skin_metrics ?? null,
});
const toMatch = (r: MatchRow): ProductMatch => ({
  id: r.id,
  productId: r.product_id,
  matchType: r.match_type as MatchType,
  createdAt: r.created_at,
});
const toCustomProduct = (r: CustomProductRow): Product => ({
  id: r.id,
  brand: r.brand,
  name: r.name,
  aliases: r.aliases ?? [],
  category: r.category as ProductCategory,
  keyIngredients: r.key_ingredients ?? [],
  relatedConcerns: (r.related_concerns ?? []) as ConcernId[],
  skinTypes: (r.skin_types ?? []) as SkinType[],
  verified: false,
  custom: true,
  imageUrl: r.image_url,
});
interface ReportRow {
  id: string;
  post_id: string;
  reason: string;
  detail: string | null;
  created_at: string;
}

const toReport = (r: ReportRow): PostReport => ({
  id: r.id,
  postId: r.post_id,
  reason: r.reason as ReportReason,
  detail: r.detail ?? '',
  createdAt: r.created_at,
});

const toPost = (r: PostRow): BoardPost => ({
  id: r.id,
  authorNickname: r.author_nickname,
  concernCategory: r.concern_category as ConcernId,
  title: r.title,
  body: r.body,
  productName: r.product_name,
  verdict: r.verdict as Verdict,
  imageUrl: r.image_url,
  likes: r.likes,
  createdAt: r.created_at,
});

function check(ctx: string, error: { message: string } | null) {
  if (error) throw new Error(`${ctx}: ${error.message}`);
}

/**
 * 새로 추가한 열·표가 아직 없는 프로젝트인지 (supabase/schema.sql 을 다시 실행하기 전).
 * 이 경우에는 에러를 던지지 않고 그 값만 비워 둬서 앱이 멈추지 않게 한다.
 */
function isMissingSchema(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  // 42703 undefined_column · 42P01 undefined_table · PGRST204/205 스키마 캐시에 없음
  if (['42703', '42P01', 'PGRST204', 'PGRST205'].includes(error.code ?? '')) return true;
  const m = (error.message ?? '').toLowerCase();
  return m.includes('does not exist') || m.includes('could not find') || m.includes('schema cache');
}

/** 스키마가 아직 없을 때만 조용히 넘어가고, 다른 에러는 그대로 알린다 */
function checkSoft(ctx: string, error: { message?: string; code?: string } | null): boolean {
  if (!error) return true;
  if (isMissingSchema(error)) {
    if (import.meta.env.DEV) console.warn(`[my-vanity] ${ctx}: supabase/schema.sql 을 다시 실행해 주세요 — ${error.message}`);
    return false;
  }
  throw new Error(`${ctx}: ${error.message}`);
}

/** 도메인 → 행: profiles 의 새 열 */
const profileExtraRow = (extra: { skinCode: string | null; skinCodeAt: string | null; feedTopics: Profile['feedTopics'] | null }) => ({
  skin_code: extra.skinCode,
  skin_code_at: extra.skinCodeAt,
  feed_topics: extra.feedTopics ?? null,
});

/** 도메인 → 행: user_product_prices */
const priceRow = (userId: string, price: ProductPrice) => ({
  user_id: userId,
  product_id: price.productId,
  price: price.price,
  volume: price.volume ?? null,
  shop: price.shop ?? null,
  updated_at: price.updatedAt,
});

/** data URL → Blob (Storage 업로드용) */
function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(',');
  const mime = /data:(.*?);/.exec(head)?.[1] ?? 'image/jpeg';
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

const PHOTO_BUCKET = 'product-photos';

/**
 * Supabase 기반 저장소 (7차시).
 * localStorage 구현과 같은 Repository 인터페이스를 구현하며, 익명 로그인으로 얻은 user_id 로 행을 구분한다.
 * 공유 제품 사진은 Storage 버킷(product-photos)에 올리고 공개 URL 만 테이블에 남긴다.
 */
export function createSupabaseRepository(): Repository {
  let userId: string | null = null;
  const uid = async () => {
    if (!userId) userId = await ensureUserId();
    return userId;
  };
  const sb = () => getSupabase();

  return {
    kind: 'supabase',

    async load(): Promise<UserData> {
      const id = await uid();
      const [pr, rt, lg, mt, cp, ph, sh, rp, bl, pc, px] = await Promise.all([
        sb().from('profiles').select('*').eq('user_id', id).maybeSingle(),
        sb().from('user_routines').select('*').eq('user_id', id).order('sort_order'),
        sb().from('skin_logs').select('*').eq('user_id', id).order('date', { ascending: false }).order('period'),
        sb().from('user_product_matches').select('*').eq('user_id', id),
        sb().from('user_products').select('*').eq('user_id', id).order('created_at'),
        sb().from('user_product_photos').select('product_id,image_url').eq('user_id', id),
        sb().from('shared_product_photos').select('product_id,image_url,created_at').order('created_at', { ascending: false }).limit(2000),
        sb().from('board_reports').select('*').eq('user_id', id),
        sb().from('user_blocks').select('blocked_nickname').eq('user_id', id),
        sb().from('user_product_prices').select('product_id,price,volume,shop,updated_at').eq('user_id', id),
        // 검사 코드·피드 설정 열이 있는지 — 프로필 행이 아직 없어도 알 수 있게 따로 물어본다
        sb().from('profiles').select('skin_code,skin_code_at,feed_topics').limit(0),
      ]);
      check('profiles', pr.error);
      check('user_routines', rt.error);
      check('skin_logs', lg.error);
      check('user_product_matches', mt.error);
      check('user_products', cp.error);
      check('user_product_photos', ph.error);
      check('shared_product_photos', sh.error);
      check('board_reports', rp.error);
      check('user_blocks', bl.error);
      // 가격 표와 검사 코드 열은 나중에 추가됐다 — 아직 없으면 그 값만 이 기기 보관분으로 채운다
      const hasPrices = checkSoft('user_product_prices', pc.error);
      const hasProfileExtra = checkSoft('profiles 검사 코드 열', px.error);
      const productPhotos: Record<string, string> = {};
      ((ph.data ?? []) as { product_id: string; image_url: string }[]).forEach((row) => {
        productPhotos[row.product_id] = row.image_url;
      });
      const sharedProductPhotos: Record<string, string> = {};
      ((sh.data ?? []) as { product_id: string; image_url: string }[]).forEach((row) => {
        // 최신순 정렬이므로 처음 만난 것이 그 제품의 대표 사진
        if (!sharedProductPhotos[row.product_id]) sharedProductPhotos[row.product_id] = row.image_url;
      });
      const loaded: UserData = {
        profile: pr.data ? toProfile(pr.data as ProfileRow) : null,
        routines: ((rt.data ?? []) as RoutineRow[]).map(toRoutine),
        logs: ((lg.data ?? []) as LogRow[]).map(toLog),
        matches: ((mt.data ?? []) as MatchRow[]).map(toMatch),
        customProducts: ((cp.data ?? []) as CustomProductRow[]).map(toCustomProduct),
        productPhotos,
        sharedProductPhotos,
        prices: hasPrices ? ((pc.data ?? []) as PriceRow[]).map(toPrice) : [],
        reports: ((rp.data ?? []) as ReportRow[]).map(toReport),
        blockedAuthors: ((bl.data ?? []) as { blocked_nickname: string }[]).map((r) => r.blocked_nickname),
      };

      // ---- 서버에 칸이 없어 이 기기에 보관해 둔 값: 칸이 생겼으면 올리고, 아니면 화면에만 얹는다
      const pending = readPending(deviceStore(), id);
      const plan = planUpload(loaded, pending, { profile: hasProfileExtra, prices: hasPrices });
      const still: PendingData = plan.remaining;
      let uploaded = 0;
      if (plan.profileExtra) {
        const { error } = await sb().from('profiles').update(profileExtraRow(plan.profileExtra)).eq('user_id', id);
        if (error) still.profileExtra = plan.profileExtra;
        else uploaded += 1;
      }
      if (plan.prices.length) {
        const { error } = await sb()
          .from('user_product_prices')
          .upsert(plan.prices.map((p) => priceRow(id, p)), { onConflict: 'user_id,product_id' });
        if (error) plan.prices.forEach((p) => (still.prices[p.productId] = p));
        else uploaded += plan.prices.length;
      }
      writePending(deviceStore(), id, still);

      const missing: MissingSchema[] = [];
      if (!hasProfileExtra) missing.push('profile');
      if (!hasPrices) missing.push('prices');
      // 방금 올린 것과 아직 보관 중인 것 모두 화면에는 보여야 한다
      const shown = mergePending(loaded, {
        profileExtra: plan.profileExtra ?? still.profileExtra,
        prices: { ...Object.fromEntries(plan.prices.map((p) => [p.productId, p])), ...still.prices },
      });
      return { ...shown, sync: { missing, pending: pendingCount(still), uploaded } };
    },

    async saveProfile(profile) {
      const id = await uid();
      const base = {
        user_id: id,
        skin_type: profile.skinType,
        concerns: profile.concerns,
        nickname: profile.nickname,
        created_at: profile.createdAt,
        agreed_at: profile.agreedAt ?? null,
        agreed_version: profile.agreedVersion ?? null,
      };
      const extra = {
        skinCode: profile.skinCode ?? null,
        skinCodeAt: profile.skinCodeAt ?? null,
        feedTopics: profile.feedTopics ?? null,
      };
      const { error } = await sb()
        .from('profiles')
        .upsert({ ...base, ...profileExtraRow(extra) }, { onConflict: 'user_id' });
      if (error && isMissingSchema(error)) {
        // 검사 결과·피드 설정 열이 아직 없는 프로젝트 — 나머지는 그대로 저장한다
        const retry = await sb().from('profiles').upsert(base, { onConflict: 'user_id' });
        check('profiles upsert', retry.error);
        // 못 올린 값은 버리지 않고 이 기기에 보관해 둔다 (칸이 생기면 load 에서 자동으로 올린다)
        if (extra.skinCode || extra.feedTopics) {
          writePending(deviceStore(), id, { ...readPending(deviceStore(), id), profileExtra: extra });
          throw new SavedOnDeviceOnly('profile');
        }
        // 보관할 값이 없어졌으면(검사 결과를 지운 경우) 예전 보관분도 지운다
        const kept = readPending(deviceStore(), id);
        if (kept.profileExtra) writePending(deviceStore(), id, { ...kept, profileExtra: null });
        return;
      }
      check('profiles upsert', error);
      // 서버에 들어갔으니 보관해 둔 예전 값은 지운다
      const pending = readPending(deviceStore(), id);
      if (pending.profileExtra) writePending(deviceStore(), id, { ...pending, profileExtra: null });
    },

    async upsertRoutineItems(items) {
      const id = await uid();
      const rows = items.map((it) => ({
        id: it.id,
        user_id: id,
        routine_type: it.routineType,
        product_id: it.productId,
        sort_order: it.sortOrder,
        started_at: it.startedAt,
      }));
      const withFreq = rows.map((r, i) => ({ ...r, frequency: items[i].frequency ?? null }));
      const { error } = await sb().from('user_routines').upsert(withFreq, { onConflict: 'id' });
      if (error && isMissingSchema(error)) {
        // frequency 열이 아직 없는 프로젝트 — 사용 빈도만 저장되지 않고 나머지는 그대로 들어간다
        const retry = await sb().from('user_routines').upsert(rows, { onConflict: 'id' });
        check('user_routines upsert', retry.error);
        return;
      }
      check('user_routines upsert', error);
    },

    async deleteRoutineItem(itemId) {
      const id = await uid();
      const { error } = await sb().from('user_routines').delete().eq('id', itemId).eq('user_id', id);
      check('user_routines delete', error);
    },

    async upsertLog(log) {
      const id = await uid();
      const row = {
        id: log.id,
        user_id: id,
        date: log.date,
        period: log.period,
        products: log.products,
        comfort: log.comfort,
        dryness: log.dryness,
        oiliness: log.oiliness,
        irritation: log.irritation,
        memo: log.memo,
        photo_url: log.photoUrl ?? null,
        skin_metrics: log.skinMetrics ?? null,
      };
      // 같은 날짜·시간대의 기록은 하나만 — (user_id, date, period) 충돌 시 기존 행을 갱신한다
      const { error } = await sb().from('skin_logs').upsert(row, { onConflict: 'user_id,date,period' });
      check('skin_logs upsert', error);
    },

    async deleteLog(logId) {
      const id = await uid();
      const { error } = await sb().from('skin_logs').delete().eq('id', logId).eq('user_id', id);
      check('skin_logs delete', error);
    },

    async upsertMatch(match) {
      const id = await uid();
      const { error } = await sb()
        .from('user_product_matches')
        .upsert(
          { id: match.id, user_id: id, product_id: match.productId, match_type: match.matchType, created_at: match.createdAt },
          { onConflict: 'user_id,product_id' },
        );
      check('user_product_matches upsert', error);
    },

    async deleteMatch(matchId) {
      const id = await uid();
      const { error } = await sb().from('user_product_matches').delete().eq('id', matchId).eq('user_id', id);
      check('user_product_matches delete', error);
    },

    async upsertCustomProduct(product) {
      const id = await uid();
      const { error } = await sb()
        .from('user_products')
        .upsert(
          {
            id: product.id,
            user_id: id,
            brand: product.brand,
            name: product.name,
            aliases: product.aliases,
            category: product.category,
            key_ingredients: product.keyIngredients,
            related_concerns: product.relatedConcerns,
            skin_types: product.skinTypes,
            image_url: product.imageUrl ?? null,
          },
          { onConflict: 'id' },
        );
      check('user_products upsert', error);
    },

    async deleteCustomProduct(productId) {
      const id = await uid();
      const { error } = await sb().from('user_products').delete().eq('id', productId).eq('user_id', id);
      check('user_products delete', error);
    },

    async upsertProductPhoto(productId, imageUrl) {
      const id = await uid();
      const { error } = await sb()
        .from('user_product_photos')
        .upsert({ user_id: id, product_id: productId, image_url: imageUrl }, { onConflict: 'user_id,product_id' });
      check('user_product_photos upsert', error);
    },

    async deleteProductPhoto(productId) {
      const id = await uid();
      const { error } = await sb().from('user_product_photos').delete().eq('product_id', productId).eq('user_id', id);
      check('user_product_photos delete', error);
    },

    async upsertProductPrice(price) {
      const id = await uid();
      const { error } = await sb().from('user_product_prices').upsert(priceRow(id, price), { onConflict: 'user_id,product_id' });
      const pending = readPending(deviceStore(), id);
      if (error && isMissingSchema(error)) {
        // 가격 표가 아직 없는 프로젝트 — 버리지 않고 이 기기에 보관해 둔다
        writePending(deviceStore(), id, { ...pending, prices: { ...pending.prices, [price.productId]: price } });
        throw new SavedOnDeviceOnly('prices');
      }
      check('user_product_prices upsert', error);
      // 서버에 들어갔으니 보관해 둔 예전 값은 지운다
      if (pending.prices[price.productId]) {
        const { [price.productId]: _done, ...rest } = pending.prices;
        writePending(deviceStore(), id, { ...pending, prices: rest });
      }
    },

    async deleteProductPrice(productId) {
      const id = await uid();
      const pending = readPending(deviceStore(), id);
      if (pending.prices[productId]) {
        const { [productId]: _removed, ...rest } = pending.prices;
        writePending(deviceStore(), id, { ...pending, prices: rest });
      }
      const { error } = await sb().from('user_product_prices').delete().eq('product_id', productId).eq('user_id', id);
      // 표가 없으면 서버에는 지울 것도 없다
      checkSoft('user_product_prices delete', error);
    },

    async shareProductPhoto(productId, imageUrl) {
      const id = await uid();
      const path = `${id}/${productId}.jpg`;
      const { error: upErr } = await sb().storage.from(PHOTO_BUCKET).upload(path, dataUrlToBlob(imageUrl), { upsert: true, contentType: 'image/jpeg' });
      check('storage upload', upErr);
      const { data } = sb().storage.from(PHOTO_BUCKET).getPublicUrl(path);
      const publicUrl = `${data.publicUrl}?v=${Date.now()}`;
      const { error } = await sb()
        .from('shared_product_photos')
        .upsert({ user_id: id, product_id: productId, image_url: publicUrl, created_at: new Date().toISOString() }, { onConflict: 'user_id,product_id' });
      check('shared_product_photos upsert', error);
      return publicUrl;
    },

    async unshareProductPhoto(productId) {
      const id = await uid();
      await sb().storage.from(PHOTO_BUCKET).remove([`${id}/${productId}.jpg`]);
      const { error } = await sb().from('shared_product_photos').delete().eq('product_id', productId).eq('user_id', id);
      check('shared_product_photos delete', error);
    },

    async listPosts() {
      const { data, error } = await sb().from('board_posts').select('*').order('created_at', { ascending: false }).limit(200);
      check('board_posts select', error);
      return ((data ?? []) as PostRow[]).map(toPost);
    },

    async createPost(post) {
      const id = await uid();
      const { data, error } = await sb()
        .from('board_posts')
        .insert({
          id: post.id,
          user_id: id,
          author_nickname: post.authorNickname,
          concern_category: post.concernCategory,
          title: post.title,
          body: post.body,
          product_name: post.productName,
          verdict: post.verdict,
          image_url: post.imageUrl,
          likes: 0,
          created_at: post.createdAt,
        })
        .select('*')
        .single();
      check('board_posts insert', error);
      return toPost(data as PostRow);
    },

    async likePost(postId) {
      const { data, error } = await sb().rpc('increment_post_likes', { post_id: postId });
      check('increment_post_likes', error);
      return typeof data === 'number' ? data : Number(data ?? 0);
    },

    async deletePost(postId) {
      const id = await uid();
      const { error } = await sb().from('board_posts').delete().eq('id', postId).eq('user_id', id);
      check('board_posts delete', error);
    },

    async reportPost(postId, reason, detail) {
      const id = await uid();
      const report: PostReport = {
        id: 'rp_' + Date.now() + '_' + postId,
        postId,
        reason,
        detail,
        createdAt: new Date().toISOString(),
      };
      const { error } = await sb()
        .from('board_reports')
        .upsert({ id: report.id, user_id: id, post_id: postId, reason, detail, created_at: report.createdAt }, { onConflict: 'user_id,post_id' });
      check('board_reports insert', error);
      return report;
    },

    async blockAuthor(nickname) {
      const id = await uid();
      const { error } = await sb()
        .from('user_blocks')
        .upsert({ user_id: id, blocked_nickname: nickname }, { onConflict: 'user_id,blocked_nickname' });
      check('user_blocks insert', error);
    },

    async unblockAuthor(nickname) {
      const id = await uid();
      const { error } = await sb().from('user_blocks').delete().eq('user_id', id).eq('blocked_nickname', nickname);
      check('user_blocks delete', error);
    },

    async deleteAllData() {
      const id = await uid();
      // 내가 올린 공유 사진·게시글까지 지운 뒤 로그아웃한다
      const tables = [
        'shared_product_photos',
        'user_product_prices',
        'board_posts',
        'board_reports',
        'user_blocks',
        'user_product_photos',
        'user_products',
        'user_product_matches',
        'skin_logs',
        'user_routines',
        'profiles',
      ];
      for (const table of tables) {
        const { error } = await sb().from(table).delete().eq('user_id', id);
        checkSoft(table + ' delete', error);
      }
      // 이 기기에만 보관해 둔 값도 같이 지운다
      writePending(deviceStore(), id, EMPTY_PENDING);
      await sb().auth.signOut();
    },
  };
}
