/**
 * 앱 안에 있는 약관·개인정보 처리방침을 그대로 정적 HTML 로 뽑는다.
 *   npm run legal:html   →  public/legal/*.html  (빌드 전에 자동 실행)
 *
 * App Store Connect 와 Google Play 는 "바로 열리는 개인정보 처리방침 주소"를 요구한다.
 * 앱은 단일 페이지라 주소로 특정 화면을 열기 어려우므로, 같은 내용을 정적 페이지로도 배포한다.
 *   https://<배포주소>/legal/privacy.html
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { LEGAL_DOCS, SUPPORT_EMAIL, TERMS_VERSION, type LegalDoc } from '../src/data/legal';

const APP_NAME = '내 화장대';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const NAV: { id: LegalDoc['id']; file: string }[] = [
  { id: 'terms', file: 'terms.html' },
  { id: 'privacy', file: 'privacy.html' },
  { id: 'rules', file: 'rules.html' },
];

function page(doc: LegalDoc): string {
  const nav = NAV.map((n) =>
    n.id === doc.id
      ? `<span class="nav is-on">${escapeHtml(LEGAL_DOCS[n.id].title)}</span>`
      : `<a class="nav" href="./${n.file}">${escapeHtml(LEGAL_DOCS[n.id].title)}</a>`,
  ).join('');

  const body = doc.sections
    .map(
      (s) =>
        `<section><h2>${escapeHtml(s.heading)}</h2>${s.body.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</section>`,
    )
    .join('');

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(doc.title)} · ${APP_NAME}</title>
<meta name="description" content="${escapeHtml(APP_NAME)} ${escapeHtml(doc.title)} (최종 수정일 ${doc.updatedAt})" />
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 32px 20px 64px;
    background: #efeae0;
    color: #1a1f1c;
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    line-height: 1.7;
  }
  main { max-width: 680px; margin: 0 auto; background: #fdfbf5; border-radius: 20px; padding: 32px 28px 40px; box-shadow: 0 10px 40px rgba(26,31,28,.08); }
  .brand { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: #8b9391; font-weight: 700; }
  h1 { font-size: 28px; margin: 6px 0 4px; line-height: 1.25; }
  .updated { font-size: 13px; color: #8b9391; margin: 0 0 20px; }
  .navs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
  .nav { display: inline-block; padding: 7px 14px; border-radius: 999px; border: 1px solid #e8e4dc; background: #fff; color: #4a5252; text-decoration: none; font-size: 13px; font-weight: 600; }
  .nav.is-on { background: #1a1f1c; border-color: #1a1f1c; color: #fdfbf5; }
  section + section { margin-top: 26px; }
  h2 { font-size: 17px; margin: 0 0 8px; }
  p { margin: 0 0 8px; font-size: 15px; color: #2c332f; }
  footer { margin-top: 32px; padding-top: 16px; border-top: 1px dashed #e8e4dc; font-size: 13px; color: #8b9391; }
  a { color: #1a1f1c; }
  @media (max-width: 520px) { body { padding: 16px 12px 48px; } main { padding: 24px 18px 32px; border-radius: 16px; } h1 { font-size: 24px; } }
</style>
</head>
<body>
<main>
  <div class="brand">${escapeHtml(APP_NAME)}</div>
  <h1>${escapeHtml(doc.title)}</h1>
  <p class="updated">최종 수정일 ${doc.updatedAt}</p>
  <nav class="navs">${nav}</nav>
  ${body}
  <footer>
    문의: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a><br />
    ${escapeHtml(APP_NAME)}은 성분 교육과 루틴 관리를 돕는 앱이며 의료 진단이나 치료를 대신하지 않습니다.
  </footer>
</main>
</body>
</html>
`;
}

mkdirSync('public/legal', { recursive: true });
NAV.forEach(({ id, file }) => writeFileSync(`public/legal/${file}`, page(LEGAL_DOCS[id]), 'utf8'));
writeFileSync(
  'public/legal/index.html',
  `<!doctype html><html lang="ko"><head><meta charset="utf-8" /><meta http-equiv="refresh" content="0; url=./privacy.html" /><title>약관 및 정책 · ${APP_NAME}</title></head><body><a href="./privacy.html">개인정보 처리방침으로 이동</a></body></html>\n`,
  'utf8',
);

console.log(`public/legal/*.html 생성 (v${TERMS_VERSION}): ${NAV.map((n) => n.file).join(', ')}, index.html`);
