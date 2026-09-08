-- ===========================================================================
--  내 화장대 — Supabase 스키마 (6차시)
--  Supabase 대시보드 > SQL Editor 에 그대로 붙여넣어 실행하세요.
--  인증은 익명 로그인(Anonymous Sign-in)을 사용하므로
--  Authentication > Providers > Anonymous Sign-ins 를 켜야 합니다.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
--  마스터 데이터 (시드로 제공, 모두에게 읽기 공개)
-- ---------------------------------------------------------------------------

create table if not exists public.ingredients (
  id             text primary key,
  name_ko        text not null,
  name_inci      text not null,
  categories     text[] not null default '{}',
  color_tag      text not null,
  short_desc     text not null,
  long_desc      text not null,
  pairs_well     text[] not null default '{}',
  pair_caution   text[] not null default '{}',
  related_concerns text[] not null default '{}',
  source         text not null default '',
  evidence_level text not null default 'moderate',
  last_reviewed  date,
  tags           text[] not null default '{}'
);

create table if not exists public.products (
  id               text primary key,
  brand            text not null,
  name             text not null,
  aliases          text[] not null default '{}',
  category         text not null,
  key_ingredients  text[] not null default '{}',
  related_concerns text[] not null default '{}',
  skin_types       text[] not null default '{}',
  verified         boolean not null default false
);

create table if not exists public.ingredient_interactions (
  id             text primary key,
  ingredient_a   text not null references public.ingredients(id),
  ingredient_b   text not null references public.ingredients(id),
  severity       text not null check (severity in ('good','neutral','caution','high_caution')),
  reason         text not null,
  recommendation text not null
);

-- ---------------------------------------------------------------------------
--  사용자 데이터 (본인만 읽기/쓰기)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  skin_type  text,
  concerns   text[] not null default '{}',
  nickname   text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_routines (
  id           text primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  routine_type text not null check (routine_type in ('AM','PM')),
  product_id   text not null,
  sort_order   integer not null default 0,
  started_at   date not null default current_date
);
create index if not exists user_routines_user_idx on public.user_routines(user_id);

create table if not exists public.skin_logs (
  id         text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null,
  period     text not null default 'PM' check (period in ('AM','PM')),
  products   text[] not null default '{}',
  comfort    smallint not null check (comfort between 1 and 5),
  dryness    smallint not null check (dryness between 1 and 5),
  oiliness   smallint not null check (oiliness between 1 and 5),
  irritation smallint not null check (irritation between 1 and 5),
  memo       text not null default '',
  unique (user_id, date, period)
);
create index if not exists skin_logs_user_idx on public.skin_logs(user_id);

create table if not exists public.user_product_matches (
  id         text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  match_type text not null check (match_type in ('good','avoided')),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
create index if not exists user_product_matches_user_idx on public.user_product_matches(user_id);

-- ---------------------------------------------------------------------------
--  커뮤니티 게시판 (모두에게 공개)
-- ---------------------------------------------------------------------------

create table if not exists public.board_posts (
  id               text primary key,
  user_id          uuid references auth.users(id) on delete set null,
  author_nickname  text not null,
  concern_category text not null,
  title            text not null check (char_length(title) between 2 and 60),
  body             text not null check (char_length(body) between 10 and 1000),
  product_name     text,
  verdict          text not null check (verdict in ('good','soso','bad')),
  image_url        text,
  likes            integer not null default 0,
  created_at       timestamptz not null default now()
);
create index if not exists board_posts_created_idx on public.board_posts(created_at desc);

-- 좋아요는 누구나 누를 수 있으므로 security definer 함수로 증가시킨다
create or replace function public.increment_post_likes(post_id text)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.board_posts set likes = likes + 1 where id = post_id returning likes;
$$;

-- ---------------------------------------------------------------------------
--  RLS
-- ---------------------------------------------------------------------------

alter table public.ingredients enable row level security;
alter table public.products enable row level security;
alter table public.ingredient_interactions enable row level security;
alter table public.profiles enable row level security;
alter table public.user_routines enable row level security;
alter table public.skin_logs enable row level security;
alter table public.user_product_matches enable row level security;
alter table public.board_posts enable row level security;

-- 마스터: 모두 읽기
drop policy if exists "ingredients read" on public.ingredients;
create policy "ingredients read" on public.ingredients for select using (true);
drop policy if exists "products read" on public.products;
create policy "products read" on public.products for select using (true);
drop policy if exists "interactions read" on public.ingredient_interactions;
create policy "interactions read" on public.ingredient_interactions for select using (true);

-- 사용자 데이터: 본인만
drop policy if exists "profiles own" on public.profiles;
create policy "profiles own" on public.profiles for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "routines own" on public.user_routines;
create policy "routines own" on public.user_routines for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "logs own" on public.skin_logs;
create policy "logs own" on public.skin_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "matches own" on public.user_product_matches;
create policy "matches own" on public.user_product_matches for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 게시판: 모두 읽기, 로그인(익명 포함) 사용자만 쓰기, 본인 글만 삭제
drop policy if exists "posts read" on public.board_posts;
create policy "posts read" on public.board_posts for select using (true);
drop policy if exists "posts insert" on public.board_posts;
create policy "posts insert" on public.board_posts for insert
  with check (auth.uid() is not null and auth.uid() = user_id);
drop policy if exists "posts delete own" on public.board_posts;
create policy "posts delete own" on public.board_posts for delete using (auth.uid() = user_id);

grant execute on function public.increment_post_likes(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
--  사용자가 직접 등록한 제품 (사진으로 등록 등) — 본인만 읽기/쓰기
-- ---------------------------------------------------------------------------

create table if not exists public.user_products (
  id               text primary key,
  user_id          uuid not null references auth.users(id) on delete cascade,
  brand            text not null,
  name             text not null,
  aliases          text[] not null default '{}',
  category         text not null,
  key_ingredients  text[] not null default '{}',
  related_concerns text[] not null default '{}',
  skin_types       text[] not null default '{}',
  image_url        text,
  created_at       timestamptz not null default now()
);
create index if not exists user_products_user_idx on public.user_products(user_id);

alter table public.user_products enable row level security;
drop policy if exists "user_products own" on public.user_products;
create policy "user_products own" on public.user_products for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
