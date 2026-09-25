import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/components.css';
import './styles/screens.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

/**
 * 홈 화면에 설치했을 때 앱처럼 열리도록 서비스 워커를 등록한다.
 * 개발 중에는 캐시 때문에 헷갈리므로 배포본에서만, 네이티브 앱(Capacitor)에서는 불필요하므로 웹에서만 등록한다.
 */
if (import.meta.env.PROD && 'serviceWorker' in navigator && !location.protocol.startsWith('capacitor')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
