# 내 화장대

> 내 루틴의 성분 궁합을 읽어주는 **스킨케어 성분 교육 · 루틴 관리 앱** (모바일 웹 우선)

## 서비스 주제

- **무엇을 하나요?** 내가 쓰는 스킨케어 제품을 아침/저녁 루틴에 담으면, 성분 조합의 궁합 점수(8~96)와 근거를 알려주고, 내 피부 고민·타입에 맞는 다음 제품을 추천합니다. 성분 백과, 고민별 집중 관리, 피부 컨디션 일지와 인사이트, 커뮤니티 게시판, 메이크업 튜토리얼(단계별 누적 일러스트)을 함께 제공합니다. 제품은 검색뿐 아니라 **사진을 찍어서** 찾거나 직접 등록할 수도 있습니다.
- **무엇이 아닌가요?** 의료 진단·치료 앱이 아닙니다. 모든 점수와 인사이트는 참고용 근사치이며, 성분 반응은 개인차가 있습니다. 심한 자극이나 트러블이 지속되면 전문의 상담을 권합니다.

## 정보구조 (하단 내비게이션 5탭)

| 탭 | 내용 |
|---|---|
| 홈 | 오늘의 루틴 궁합 요약, 오늘의 성분 카드, 커뮤니티·튜토리얼 미리보기 |
| 내 제품 | 제품 검색/사진 등록, 아침·저녁 루틴, 성분 궁합 분석(근거 포함), 내 피부 궁합 기록, 고민 기반 추천 |
| 성분 | 성분 검색 + 카테고리 필터 + 성분 상세(자세히 보기, 궁합 성분, 제품 예시, 출처) |
| 관리 | 피부 고민별(8종) 집중 관리와 추천 성분 |
| 기록 | 피부 컨디션 일지, 타임라인, 인사이트 분석(3일 이상 기록 시) |

전체 화면 오버레이: 온보딩/프로필 수정, 커뮤니티 게시판(다른 사람들의 화장대), 메이크업 튜토리얼(눈화장 8 · 블러셔 4 · 코쉐딩 3), 사진으로 제품 찾기.

## 기술 스택

- React 19 + Vite + TypeScript (SPA, 상태 기반 화면 전환)
- 상태 관리: zustand. 저장소는 `Repository` 인터페이스 뒤에 두고 **localStorage → Supabase** 로 교체 (`src/store/`)
- 처리 로직: `src/engine/` (궁합 점수 · 추천 · 의심 성분 · 기록 인사이트), vitest 단위 테스트
- 사진 인식: tesseract.js (브라우저 OCR, 한글+영문) — 서버 없이 기기에서 처리
- 배포: Vercel / 데이터: Supabase (익명 로그인 + RLS)

## 실행

```bash
npm install
npm run dev
```

- `npm run build` — 타입 검사 + 프로덕션 빌드 (`dist/`)
- `npm test` — 엔진 단위 테스트
- `npm run seed:sql` — 번들된 시드 데이터로 `supabase/seed.sql` 생성

환경변수가 없으면 앱은 **localStorage 모드**로 완전히 동작합니다.

## Supabase 연동 (6~8차시)

1. [supabase.com](https://supabase.com) 에서 프로젝트를 만듭니다.
2. **Authentication → Providers → Anonymous Sign-ins** 를 켭니다. (기기별 익명 사용자로 데이터를 구분합니다)
3. **SQL Editor** 에서 `supabase/schema.sql` 을 실행합니다. (테이블 · RLS · 좋아요 함수)
4. `npm run seed:sql` 로 만든 `supabase/seed.sql` 을 SQL Editor 에서 실행합니다. (제품 471 · 성분 113 · 상호작용 61 · 데모 게시글)
5. `.env.example` 을 `.env.local` 로 복사하고 **Project Settings → API** 의 URL 과 anon key 를 채웁니다.

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

6. `npm run dev` 를 다시 실행하면 홈 상단에 "☁️ 서버(Supabase)에 저장" 이 표시됩니다. 서버 연결에 실패하면 자동으로 localStorage 모드로 내려앉고 안내가 표시됩니다.

## 제품 사진과 영상 튜토리얼

- **제품 사진.** 시드 제품에는 카테고리별 일러스트(병·스포이드·자·튜브 등)를 브랜드 색으로 보여줍니다. 사진으로 제품을 찾아 담으면 그 사진이 자동으로 제품 사진이 되고, 카드의 썸네일을 눌러 직접 찍거나 앨범에서 골라 붙일 수도 있습니다. 사진은 내 저장소(`user_product_photos`)에만 저장됩니다.
- **영상으로 배우기.** 튜토리얼의 "영상으로 배우기" 탭에서 눈화장·블러셔·코쉐딩·베이스·립·눈썹 등 종류별 YouTube 영상을 앱 안에서 재생합니다. 기본은 존재·임베드 가능 여부를 확인한 큐레이션 목록이고, `.env.local` 에 `VITE_YOUTUBE_API_KEY` 를 넣으면 YouTube Data API v3 로 종류별 최신 영상을 실시간 검색합니다(결과는 24시간 캐시). 키는 Google Cloud 콘솔에서 HTTP 리퍼러로 제한하세요.

테이블: `profiles`, `user_routines`, `skin_logs`, `user_product_matches`, `user_products`(직접 등록 제품), `board_posts`(공개), 마스터 `products`, `ingredients`, `ingredient_interactions`.
앱은 마스터 데이터를 번들에서 읽고(오프라인·속도), 사용자 데이터는 Supabase 에서 읽고 씁니다.

## Vercel 배포 (5차시)

1. GitHub 에 저장소를 올립니다.
   ```bash
   git remote add origin https://github.com/<계정>/my-vanity.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) → **Add New Project** → 저장소 선택. `vercel.json` 이 프레임워크(Vite)·빌드·SPA 리라이트를 정의합니다.
3. (Supabase 사용 시) **Environment Variables** 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 를 추가하고 배포합니다.

## 개발 차시

| 차시 | 단계 | 목표 |
|---|---|---|
| 1 | 준비 | 저장소 초기화, 스캐폴딩, 서비스 주제 확정 |
| 2 | 프론트 | 하단 내비게이션 + 페이지 뼈대, 온보딩 |
| 3 | 프론트 | 시드 데이터, 제품 검색/등록 폼, 성분 백과 검색, 입력값 검증 |
| 4 | 프론트 | 성분 궁합 점수 엔진, 고민 기반 추천 엔진, 인사이트 엔진 |
| 5 | 프론트 | 결과 화면 완성, Vercel 배포 설정 |
| 6 | 서버·DB | Supabase 스키마·시드 SQL·클라이언트·환경변수 |
| 7 | 서버·DB | localStorage → Supabase read/write 교체 (Repository 교체) |
| 8 | 서버·DB | 재방문 시 저장 데이터 복원, 서버 실패 시 로컬 폴백, 저장 모드 표시 |
| + | 추가 | 사진으로 제품 찾기(OCR) · 직접 등록 |

## 폴더 구조

```
src/
  types/        도메인 타입
  data/         시드 데이터(성분·제품·상호작용·튜토리얼·게시글), 검색
  engine/       궁합 점수 · 추천 · 의심 성분 · 인사이트 (순수 함수 + 테스트)
  store/        Repository(local/supabase) · zustand 스토어 · 카탈로그 훅
  components/   레이아웃 · 온보딩 · 제품 · 성분 · 관리 · 게시판 · 튜토리얼(SVG 일러스트)
  pages/        홈 · 내 제품 · 성분 · 관리 · 기록
  lib/          날짜 · id · 이미지 리사이즈 · Supabase 클라이언트 · OCR
supabase/       schema.sql, seed.sql
scripts/        gen-seed-sql.ts
```

## 데이터 신뢰성 안내

- 제품·성분 데이터는 데모용 시드이며 카드에 "데모·미검증" 표기를 유지합니다.
- "안전하다", "피부가 좋아진다" 같은 단정 표현을 쓰지 않습니다. 대신 "일반적으로 사용되는 성분", "반응은 개인차가 있을 수 있어요" 톤을 유지합니다.
- 궁합 점수·인사이트·추천은 참고용 근사치이며 의학적 진단이 아닙니다. 상관관계는 인과관계가 아닙니다.
