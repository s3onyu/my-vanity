import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * 설치형 앱(Capacitor)에서만 동작하는 네이티브 연결.
 * - Android 하드웨어 뒤로가기 → 오버레이 닫기 / 홈으로 / 앱 종료
 * - 스플래시 숨김, 상태바 스타일
 * 웹에서는 아무것도 하지 않는다.
 */
export function setupNative(handlers: { onBack: () => 'handled' | 'exit' }) {
  if (!Capacitor.isNativePlatform()) return () => undefined;

  void SplashScreen.hide().catch(() => undefined);
  void StatusBar.setStyle({ style: Style.Light }).catch(() => undefined);
  if (Capacitor.getPlatform() === 'android') {
    void StatusBar.setBackgroundColor({ color: '#FDFBF5' }).catch(() => undefined);
  }

  const listener = CapApp.addListener('backButton', () => {
    if (handlers.onBack() === 'exit') void CapApp.exitApp();
  });
  return () => {
    void listener.then((l) => l.remove());
  };
}
