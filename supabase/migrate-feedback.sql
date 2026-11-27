-- ===========================================================================
--  내 화장대 — 피드백 반영분만 따로 적용하는 SQL
--  (피부 유형 검사 코드 · 사용 빈도 · 내가 산 가격 · 피드 관심 분야)
--
--  Supabase 대시보드 > SQL Editor 에 이 파일 내용을 전부 붙여넣고 Run 을 누르세요.
--  schema.sql 맨 아래 구간과 같은 내용이고, 여러 번 실행해도 안전합니다.
--  끝나면 결과 표에 일곱 칸이 모두 true 로 나와야 합니다.
-- ===========================================================================

-- 피부 유형 검사 결과(4축 코드)와 커뮤니티 피드 관심 분야 비중
alter table public.profiles add column if not exists skin_code    text;
alter table public.profiles add column if not exists skin_code_at timestamptz;
alter table public.profiles add column if not exists feed_topics  jsonb;

-- 제품별 사용 빈도 — {"kind":"daily"} | {"kind":"alt"} | {"kind":"weekdays","days":[1,4]}
alter table public.user_routines add column if not exists frequency jsonb;

-- 직접 등록한 제품의 용량 (1ml 당 가격 계산용)
alter table public.user_products add column if not exists volume numeric;

-- 내가 적어 둔 제품 가격 — 본인만 읽기/쓰기
create table if not exists public.user_product_prices (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  price      integer not null check (price > 0 and price <= 10000000),
  volume     numeric check (volume is null or volume > 0),
  shop       text,
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.user_product_prices enable row level security;
drop policy if exists "user_product_prices own" on public.user_product_prices;
create policy "user_product_prices own" on public.user_product_prices for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- API 서버가 새 열·표를 바로 알아보게 한다 (안 하면 잠깐 동안 "schema cache" 오류가 날 수 있다)
notify pgrst, 'reload schema';

-- 적용 확인 — 일곱 칸이 모두 true 여야 한다
select
  exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles'      and column_name = 'skin_code')    as "profiles.skin_code",
  exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles'      and column_name = 'skin_code_at') as "profiles.skin_code_at",
  exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles'      and column_name = 'feed_topics')  as "profiles.feed_topics",
  exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'user_routines' and column_name = 'frequency')    as "user_routines.frequency",
  exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'user_products' and column_name = 'volume')       as "user_products.volume",
  exists (select 1 from information_schema.tables  where table_schema = 'public' and table_name = 'user_product_prices')                             as "user_product_prices",
  exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_product_prices' and policyname = 'user_product_prices own')   as "가격 표 본인 전용 정책";
