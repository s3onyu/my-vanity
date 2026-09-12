import type {
  BoardPost,
  ConcernId,
  MatchType,
  Product,
  ProductCategory,
  Profile,
  ProductMatch,
  RoutineItem,
  RoutineType,
  SkinLog,
  SkinMetrics,
  SkinType,
  Verdict,
} from '@/types';
import { ensureUserId, getSupabase } from '@/lib/supabase';
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
}
interface RoutineRow {
  id: string;
  routine_type: string;
  product_id: string;
  sort_order: number;
  started_at: string;
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
});
const toRoutine = (r: RoutineRow): RoutineItem => ({
  id: r.id,
  routineType: r.routine_type as RoutineType,
  productId: r.product_id,
  sortOrder: r.sort_order,
  startedAt: r.started_at,
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
      const [pr, rt, lg, mt, cp, ph, sh] = await Promise.all([
        sb().from('profiles').select('*').eq('user_id', id).maybeSingle(),
        sb().from('user_routines').select('*').eq('user_id', id).order('sort_order'),
        sb().from('skin_logs').select('*').eq('user_id', id).order('date', { ascending: false }).order('period'),
        sb().from('user_product_matches').select('*').eq('user_id', id),
        sb().from('user_products').select('*').eq('user_id', id).order('created_at'),
        sb().from('user_product_photos').select('product_id,image_url').eq('user_id', id),
        sb().from('shared_product_photos').select('product_id,image_url,created_at').order('created_at', { ascending: false }).limit(2000),
      ]);
      check('profiles', pr.error);
      check('user_routines', rt.error);
      check('skin_logs', lg.error);
      check('user_product_matches', mt.error);
      check('user_products', cp.error);
      check('user_product_photos', ph.error);
      check('shared_product_photos', sh.error);
      const productPhotos: Record<string, string> = {};
      ((ph.data ?? []) as { product_id: string; image_url: string }[]).forEach((row) => {
        productPhotos[row.product_id] = row.image_url;
      });
      const sharedProductPhotos: Record<string, string> = {};
      ((sh.data ?? []) as { product_id: string; image_url: string }[]).forEach((row) => {
        // 최신순 정렬이므로 처음 만난 것이 그 제품의 대표 사진
        if (!sharedProductPhotos[row.product_id]) sharedProductPhotos[row.product_id] = row.image_url;
      });
      return {
        profile: pr.data ? toProfile(pr.data as ProfileRow) : null,
        routines: ((rt.data ?? []) as RoutineRow[]).map(toRoutine),
        logs: ((lg.data ?? []) as LogRow[]).map(toLog),
        matches: ((mt.data ?? []) as MatchRow[]).map(toMatch),
        customProducts: ((cp.data ?? []) as CustomProductRow[]).map(toCustomProduct),
        productPhotos,
        sharedProductPhotos,
      };
    },

    async saveProfile(profile) {
      const id = await uid();
      const { error } = await sb()
        .from('profiles')
        .upsert(
          { user_id: id, skin_type: profile.skinType, concerns: profile.concerns, nickname: profile.nickname, created_at: profile.createdAt },
          { onConflict: 'user_id' },
        );
      check('profiles upsert', error);
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
      const { error } = await sb().from('user_routines').upsert(rows, { onConflict: 'id' });
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
  };
}
