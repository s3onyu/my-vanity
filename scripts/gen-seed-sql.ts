/**
 * 앱에 번들된 시드 데이터(TS)를 Supabase 용 SQL 로 변환한다.
 *   npm run seed:sql
 *     → supabase/seed-posts.sql  예시 게시글만 (수 KB, 서버 연결 시 실행 권장)
 *     → supabase/seed.sql        성분·제품·상호작용까지 전부 (수백 KB, 선택)
 *
 * 앱은 성분·제품 같은 마스터 데이터를 번들에서 바로 읽기 때문에 seed.sql 은 없어도 동작한다.
 * 반면 게시글은 서버(board_posts)에서만 읽으므로, 서버 모드에서 게시판이 비어 보이지 않게
 * seed-posts.sql 을 한 번 실행해 두는 편이 좋다.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { INGREDIENTS, INTERACTIONS, PRODUCTS } from '../src/data/index';
import { BOARD_SEED } from '../src/data/boardSeed';

const q = (s: string | null | undefined) => (s === null || s === undefined ? 'null' : `'${String(s).replace(/'/g, "''")}'`);
const arr = (a: readonly string[] | undefined) => (a && a.length ? `array[${a.map(q).join(',')}]::text[]` : `'{}'::text[]`);
const bool = (b: boolean) => (b ? 'true' : 'false');

const lines: string[] = [];
lines.push('-- 내 화장대 마스터 데이터 시드 (자동 생성: npm run seed:sql)');
lines.push('-- 데모/미검증 데이터입니다. 같은 id 는 upsert 됩니다.');
lines.push('begin;');

lines.push('\n-- ingredients');
INGREDIENTS.forEach((i) => {
  lines.push(
    `insert into public.ingredients (id,name_ko,name_inci,categories,color_tag,short_desc,long_desc,pairs_well,pair_caution,related_concerns,source,evidence_level,last_reviewed,tags) values (` +
      [
        q(i.id),
        q(i.nameKo),
        q(i.nameInci),
        arr(i.categories),
        q(i.colorTag),
        q(i.shortDesc),
        q(i.longDesc),
        arr(i.pairsWell),
        arr(i.pairCaution),
        arr(i.relatedConcerns),
        q(i.source),
        q(i.evidenceLevel),
        q(i.lastReviewed),
        arr(i.tags),
      ].join(',') +
      `) on conflict (id) do update set name_ko=excluded.name_ko,name_inci=excluded.name_inci,categories=excluded.categories,color_tag=excluded.color_tag,short_desc=excluded.short_desc,long_desc=excluded.long_desc,pairs_well=excluded.pairs_well,pair_caution=excluded.pair_caution,related_concerns=excluded.related_concerns,source=excluded.source,evidence_level=excluded.evidence_level,last_reviewed=excluded.last_reviewed,tags=excluded.tags;`,
  );
});

lines.push('\n-- products');
PRODUCTS.forEach((p) => {
  lines.push(
    `insert into public.products (id,brand,name,aliases,category,key_ingredients,related_concerns,skin_types,verified) values (` +
      [q(p.id), q(p.brand), q(p.name), arr(p.aliases), q(p.category), arr(p.keyIngredients), arr(p.relatedConcerns), arr(p.skinTypes), bool(p.verified)].join(',') +
      `) on conflict (id) do update set brand=excluded.brand,name=excluded.name,aliases=excluded.aliases,category=excluded.category,key_ingredients=excluded.key_ingredients,related_concerns=excluded.related_concerns,skin_types=excluded.skin_types,verified=excluded.verified;`,
  );
});

lines.push('\n-- ingredient_interactions');
INTERACTIONS.forEach((x) => {
  lines.push(
    `insert into public.ingredient_interactions (id,ingredient_a,ingredient_b,severity,reason,recommendation) values (` +
      [q(x.id), q(x.ingredientA), q(x.ingredientB), q(x.severity), q(x.reason), q(x.recommendation)].join(',') +
      `) on conflict (id) do update set ingredient_a=excluded.ingredient_a,ingredient_b=excluded.ingredient_b,severity=excluded.severity,reason=excluded.reason,recommendation=excluded.recommendation;`,
  );
});

const postLines: string[] = [];
BOARD_SEED.forEach((b) => {
  postLines.push(
    `insert into public.board_posts (id,user_id,author_nickname,concern_category,title,body,product_name,verdict,image_url,likes,created_at) values (` +
      [q(b.id), 'null', q(b.authorNickname), q(b.concernCategory), q(b.title), q(b.body), q(b.productName), q(b.verdict), q(b.imageUrl), String(b.likes), q(b.createdAt)].join(',') +
      `) on conflict (id) do nothing;`,
  );
});
lines.push('\n-- board_posts (예시 게시글, 작성자 user_id 없음)');
lines.push(...postLines);

lines.push('\ncommit;');

mkdirSync('supabase', { recursive: true });
writeFileSync('supabase/seed.sql', lines.join('\n') + '\n', 'utf8');

// 서버 연결 직후 실행할 작은 파일 — 예시 게시글만 담는다
writeFileSync(
  'supabase/seed-posts.sql',
  [
    '-- 내 화장대 예시 게시글 (자동 생성: npm run seed:sql)',
    '-- Supabase SQL Editor 에 붙여넣고 실행하세요. 같은 id 는 건너뜁니다.',
    '-- 화면에는 "예시 글" 배지가 붙어 실제 사용자 후기와 구분됩니다.',
    'begin;',
    '',
    ...postLines,
    '',
    'commit;',
  ].join('\n') + '\n',
  'utf8',
);
console.log(
  `supabase/seed-posts.sql 생성: 예시 게시글 ${BOARD_SEED.length}개 (서버 연결 시 실행 권장)\n` +
    `supabase/seed.sql 생성: 성분 ${INGREDIENTS.length}, 제품 ${PRODUCTS.length}, 상호작용 ${INTERACTIONS.length} (선택)`,
);
