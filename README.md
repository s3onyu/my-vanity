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

## 폰에 설치하기 (Capacitor 네이티브 앱)

`android/`, `ios/` 폴더가 네이티브 프로젝트입니다. 웹을 고친 뒤 `npm run cap:sync` 로 빌드 결과를 두 프로젝트에 복사합니다.

- **Android (이 컴퓨터에서 가능):** Android Studio 설치 → `npm run cap:android` → 기기 연결 후 ▶ 실행. 스토어 출시는 Build → Generate Signed Bundle(AAB).
- **iOS (Mac 필요):** Xcode 설치 → 이 폴더를 Mac 으로 옮기고 `npm install && npm run cap:ios` → Signing & Capabilities 에서 팀 선택 → 기기 실행 → Product → Archive 로 App Store Connect 업로드.
- **출시 전 반드시:** `capacitor.config.ts` 의 `appId` 를 본인 도메인 기준으로 바꾸세요(예: `com.yourname.myvanity`). 아이콘·스플래시는 `node scripts/gen-icons.mjs && npx @capacitor/assets generate` 로 다시 만들 수 있습니다.
- 카메라·사진 권한 문구는 `ios/App/App/Info.plist`(NSCameraUsageDescription 등)와 `android/app/src/main/AndroidManifest.xml` 에 들어 있습니다.
- 설치형 앱에서 `/api` 함수를 쓰려면 `.env.local` 에 `VITE_API_BASE=https://<배포 도메인>` 을 넣고 빌드하세요.
- PWA 로도 설치됩니다: 폰 브라우저에서 배포 주소를 열고 "홈 화면에 추가".

## 사진 기능

- **제품 사진 찾기·등록:** 설치형 앱에서는 기기 카메라 권한으로 바로 찍고, 웹에서는 브라우저 카메라를 씁니다. 글자 인식(OCR)은 기기 안에서 처리됩니다.
- **피부 사진 기록:** 기록 탭에서 앱 안 카메라(얼굴 가이드 오버레이)로 찍어 아침/저녁 기록에 저장합니다. 홍조·광택·균일도는 기기 안에서 계산하는 **상대 비교용 참고 지표**이며 진단이 아닙니다. 타임라인의 "날짜별 사진 비교", 인사이트의 "피부 사진 추이"에서 변화를 봅니다.
- 사진은 로컬 모드에서 IndexedDB 에, 서버 모드에서 Supabase(skin_logs.photo_url)에 저장되며 서버로 분석을 보내지 않습니다.

## 실제 제품 사진 (출처 우선순위)

1. 내가 찍어 붙인 사진 → 2. 다른 사용자가 공유한 사진(Supabase Storage `product-photos`) → 3. **네이버 쇼핑 검색 API** → 4. **Open Beauty Facts**(CC BY-SA) → 5. 카테고리 일러스트.

- 네이버: [developers.naver.com](https://developers.naver.com) 에서 애플리케이션을 등록하고 "검색" API 를 추가한 뒤 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 을 `.env.local`(개발)과 Vercel 환경변수(배포)에 넣습니다. 키는 서버 함수 `api/product-image.ts` 에서만 읽습니다. 이용약관에 따라 결과를 DB 에 저장하지 않고 출처·링크를 표시합니다(기기 캐시 1일).
- Open Beauty Facts 는 키 없이 동작하지만 국내 제품 커버리지가 낮고 분당 10회 제한이 있어 천천히 채워집니다.
- 브랜드 공식 이미지는 허락 없이 쓰지 않습니다. 사용자가 공유한 사진은 제품 식별용으로만 표시합니다.

## 커뮤니티 후기 검색

게시판 상단 검색창에 제품 이름을 넣으면 제품명·제목·본문에서 후기를 찾습니다. 제품 카드의 "💬 후기 N건 보기"로 바로 들어가고, 없으면 그 제품으로 첫 후기 쓰기 폼이 열립니다.

## 제품 사진과 영상 튜토리얼

- **제품 사진.** 시드 제품에는 카테고리별 일러스트(병·스포이드·자·튜브 등)를 브랜드 색으로 보여줍니다. 사진으로 제품을 찾아 담으면 그 사진이 자동으로 제품 사진이 되고, 카드의 썸네일을 눌러 직접 찍거나 앨범에서 골라 붙일 수도 있습니다. 사진은 내 저장소(`user_product_photos`)에만 저장됩니다.
- **영상으로 배우기.** 튜토리얼의 "영상으로 배우기" 탭에서 눈화장·블러셔·코쉐딩·베이스·립·눈썹 등 종류별 YouTube 영상을 앱 안에서 재생합니다. 기본은 존재·임베드 가능 여부를 확인한 큐레이션 목록이고, `.env.local` 에 `VITE_YOUTUBE_API_KEY` 를 넣으면 YouTube Data API v3 로 종류별 최신 영상을 실시간 검색합니다(결과는 24시간 캐시). 키는 Google Cloud 콘솔에서 HTTP 리퍼러로 제한하세요.

테이블: `profiles`, `user_routines`, `skin_logs`, `user_product_matches`, `user_products`(직접 등록 제품), `board_posts`(공개), 마스터 `products`, `ingredients`, `ingredient_interactions`.
앱은 마스터 데이터를 번들에서 읽고(오프라인·속도), 사용자 데이터는 Supabase 에서 읽고 씁니다.

## 배포 파이프라인 (Git → GitHub → Vercel)

내 컴퓨터에서 커밋하면 GitHub 에 올라가고, Vercel 이 그 저장소를 지켜보다가 자동으로 배포합니다.

```
git commit  →  git push  →  GitHub(s3onyu/my-vanity)  →  Vercel 자동 빌드·배포
```

### 1. GitHub (연결 완료)

원격은 `https://github.com/s3onyu/my-vanity.git` 이고 `main` 브랜치가 추적됩니다. 이후에는 아래 세 줄만 반복하면 됩니다.

```bash
git add -A
git commit -m "무엇을 했는지"
git push
```

### 2. Vercel 연결 (브라우저에서 한 번만)

1. [vercel.com](https://vercel.com) 에 GitHub 계정으로 로그인합니다.
2. **Add New → Project → Import** 에서 `my-vanity` 저장소를 고릅니다.
3. 프레임워크·빌드·출력 폴더는 `vercel.json` 이 정의하므로 그대로 둡니다. `api/` 의 서버 함수도 자동 인식됩니다.
4. **Environment Variables** 에 아래를 넣습니다. `VITE_` 로 시작하는 값은 브라우저에 포함되고, 나머지는 서버 함수에서만 읽습니다.

   | 이름 | 필요성 | 없으면 |
   |---|---|---|
   | `VITE_SUPABASE_URL` | 서버 저장 | 이 기기에만 저장 |
   | `VITE_SUPABASE_ANON_KEY` | 서버 저장 | 이 기기에만 저장 |
   | `NAVER_CLIENT_ID` | 실제 상품 사진 | 일러스트로 표시 |
   | `NAVER_CLIENT_SECRET` | 실제 상품 사진 | 일러스트로 표시 |
   | `VITE_YOUTUBE_API_KEY` | 영상 실시간 검색 | 큐레이션 목록 |
   | `VITE_API_BASE` | 설치형 앱에서만 | 같은 도메인 사용 |

5. **Deploy** 를 누릅니다. 이후 `git push` 할 때마다 자동으로 다시 배포되고, 브랜치를 따로 올리면 미리보기 주소가 생깁니다.

배포 주소를 아이폰 사파리에서 열고 공유 → **홈 화면에 추가** 를 누르면 App Store 없이도 앱처럼 설치돼 카메라까지 동작합니다.

## Mac 없이 App Store 올리기

앱 식별자는 `com.s3onyu.myvanity`, 버전은 `1.0.0` 입니다. iOS 빌드는 Mac 에서만 되지만, GitHub 의 macOS 러너가 대신 빌드하므로 Windows 에서도 출시할 수 있습니다.

### 1. 준비 (브라우저에서)

1. [developer.apple.com](https://developer.apple.com) 에서 Apple Developer Program 에 가입합니다. 연 99달러이고 승인에 1~2일 걸립니다.
2. [App Store Connect](https://appstoreconnect.apple.com) → **앱 → 새로운 앱** 에서 번들 ID `com.s3onyu.myvanity` 로 앱을 만듭니다.
3. **사용자 및 액세스 → 통합 → App Store Connect API** 에서 **App Manager** 권한의 팀 키를 만들고 `.p8` 파일을 내려받습니다. 이 파일은 한 번만 받을 수 있습니다.

### 2. GitHub 시크릿 등록

저장소 **Settings → Secrets and variables → Actions** 에 네 개를 넣습니다.

| 이름 | 어디서 |
|---|---|
| `APPSTORE_KEY_ID` | API 키 목록의 Key ID (10자) |
| `APPSTORE_ISSUER_ID` | 같은 화면 위쪽 Issuer ID (UUID) |
| `APPSTORE_KEY_P8` | 내려받은 `AuthKey_XXXX.p8` 파일 내용 전체 |
| `APPLE_TEAM_ID` | developer.apple.com → Membership → Team ID |

### 3. 빌드와 업로드

저장소 **Actions → iOS TestFlight 업로드 → Run workflow** 를 누르면 빌드해서 TestFlight 에 올립니다. `v1.0.0` 같은 태그를 푸시해도 실행됩니다.

```bash
git tag v1.0.0
git push origin v1.0.0
```

서명 인증서와 프로비저닝 프로파일은 Xcode 가 API 키로 자동 발급하므로 따로 만들 필요가 없습니다. 빌드 번호는 실행 번호로 자동 증가합니다.

### 4. 심사 제출

1. 아이폰에 TestFlight 앱을 설치해 올라온 빌드를 받아 확인합니다.
2. 아이폰에서 스크린샷을 찍습니다. 6.9인치(아이폰 16 Pro Max 등) 기준 3장 이상이 필요합니다.
3. App Store Connect 에 설명, 키워드, 카테고리(라이프스타일), 연령 등급(게시판이 있어 12+ 권장), 개인정보 처리방침 주소를 입력합니다.
   - 처리방침 주소: `https://<배포주소>/legal/privacy.html`
   - 이용약관: `https://<배포주소>/legal/terms.html`
4. 심사 메모에 "성분 교육·루틴 관리 앱이며 의료 진단 기능이 없음, 커뮤니티에는 신고·차단·약관 동의·데이터 삭제 기능이 있음" 을 적습니다.
5. 제출하면 보통 1~3일 안에 결과가 나옵니다.

### 심사 대비로 이미 들어간 것

- 게시글 신고(사유 6종)와 작성자 차단, 차단 목록 관리
- 첫 글쓰기 전 이용약관·개인정보 처리방침·커뮤니티 규칙 동의, 버전이 바뀌면 재동의
- 설정에서 내 데이터·계정 삭제 (2단계 확인)
- 기본 게시글에 "예시 글" 표시, 실제 상품명 대신 유형 표기
- 카메라·사진 접근 목적 문구 (`ios/App/App/Info.plist`)

법적 문서 본문은 `src/data/legal.ts` 한 곳에서 관리하고, 빌드할 때 `public/legal/*.html` 로 자동 생성됩니다. 내용을 고치면 `TERMS_VERSION` 을 올려 사용자에게 다시 동의를 받습니다.

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
| + | 추가 | 사진으로 제품 찾기(OCR) · 직접 등록 · 피부 사진 기록 · 실제 제품 사진 · 후기 검색 · Capacitor 네이티브 앱 |

## 폴더 구조

```
src/
  types/        도메인 타입
  data/         시드 데이터(성분·제품·상호작용·튜토리얼·게시글), 검색
  engine/       궁합 점수 · 추천 · 의심 성분 · 인사이트 (순수 함수 + 테스트)
  store/        Repository(local/supabase) · zustand 스토어 · 카탈로그 훅
  components/   레이아웃 · 온보딩 · 제품 · 성분 · 관리 · 게시판 · 튜토리얼(SVG 일러스트)
  pages/        홈 · 내 제품 · 성분 · 관리 · 기록
  lib/          날짜 · id · 이미지 · Supabase · OCR · 카메라(네이티브/웹) · 제품 사진 소스 · IndexedDB 사진 저장
api/          Vercel 서버 함수 (네이버 쇼핑 이미지 프록시)
android/ ios/ Capacitor 네이티브 프로젝트
resources/    아이콘·스플래시 원본 (scripts/gen-icons.mjs 로 생성)
supabase/       schema.sql, seed.sql
scripts/        gen-seed-sql.ts
```

## 데이터 신뢰성 안내

- 제품·성분 데이터는 데모용 시드이며 카드에 "데모·미검증" 표기를 유지합니다.
- "안전하다", "피부가 좋아진다" 같은 단정 표현을 쓰지 않습니다. 대신 "일반적으로 사용되는 성분", "반응은 개인차가 있을 수 있어요" 톤을 유지합니다.
- 궁합 점수·인사이트·추천은 참고용 근사치이며 의학적 진단이 아닙니다. 상관관계는 인과관계가 아닙니다.
