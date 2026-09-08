/**
 * 앱에 번들된 시드 데이터(TS)를 Supabase 마스터 테이블용 SQL 로 변환한다.
 *   npm run seed:sql   →  supabase/seed.sql
 * 생성된 파일을 Supabase SQL Editor 에서 실행하면
 * products / ingredients / ingredient_interactions / board_posts(데모) 가 채워진다.
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

lines.push('\n-- board_posts (데모 게시글, 작성자 user_id 없음)');
BOARD_SEED.forEach((b) => {
  lines.push(
    `insert into public.board_posts (id,user_id,author_nickname,concern_category,title,body,product_name,verdict,image_url,likes,created_at) values (` +
      [q(b.id), 'null', q(b.authorNickname), q(b.concernCategory), q(b.title), q(b.body), q(b.productName), q(b.verdict), q(b.imageUrl), String(b.likes), q(b.createdAt)].join(',') +
      `) on conflict (id) do nothing;`,
  );
});

lines.push('\ncommit;');

mkdirSync('supabase', { recursive: true });
writeFileSync('supabase/seed.sql', lines.join('\n') + '\n', 'utf8');
console.log(
  `supabase/seed.sql 생성: 성분 ${INGREDIENTS.length}, 제품 ${PRODUCTS.length}, 상호작용 ${INTERACTIONS.length}, 데모 게시글 ${BOARD_SEED.length}`,
);
