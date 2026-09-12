import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor 네이티브 앱 설정.
 * appId 는 App Store / Play 스토어에서 앱을 구분하는 고유 값이라 출시 전에 본인 도메인 기준으로 바꾸세요 (예: com.yourname.myvanity).
 * 한 번 출시하면 바꿀 수 없습니다.
 */
const config: CapacitorConfig = {
  appId: 'com.myvanity.app',
  appName: '내 화장대',
  webDir: 'dist',
  android: {
    // 카메라(getUserMedia)와 보안 컨텍스트가 필요한 API 를 위해 https 스킴 사용
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'automatic',
    // 앱 안 카메라 미리보기(<video playsinline>)를 위해
    allowsLinkPreview: false,
  },
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      launchAutoHide: true,
      backgroundColor: '#FDFBF5',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FDFBF5',
    },
  },
};

export default config;
