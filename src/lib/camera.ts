import { Capacitor } from '@capacitor/core';
import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';
import { resizeImage } from './image';

export const isNativeApp = () => Capacitor.isNativePlatform();

export type PhotoSource = 'camera' | 'gallery';

export interface CapturePhotoOptions {
  source: PhotoSource;
  /** 카메라 방향 — 'user' 는 전면(셀피), 'environment' 는 후면 */
  facing?: 'user' | 'environment';
  /** 긴 변 px */
  maxSide?: number;
  quality?: number;
}

/**
 * 사진 한 장을 data URL 로 가져온다.
 * - 설치형 앱(Capacitor): 네이티브 카메라/앨범 플러그인 (권한 요청 포함)
 * - 웹: <input type="file"> (모바일 브라우저는 capture 속성으로 카메라를 바로 연다)
 * 사용자가 취소하면 null.
 */
export async function capturePhoto({ source, facing = 'environment', maxSide = 1600, quality = 0.9 }: CapturePhotoOptions): Promise<string | null> {
  if (isNativeApp()) {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
        direction: facing === 'user' ? CameraDirection.Front : CameraDirection.Rear,
        quality: Math.round(quality * 100),
        width: maxSide,
        height: maxSide,
        correctOrientation: true,
        saveToGallery: false,
      });
      return photo.dataUrl ?? null;
    } catch (err) {
      const msg = String((err as Error)?.message ?? err);
      // 사용자가 취소한 경우는 오류가 아니다
      if (/cancel/i.test(msg)) return null;
      throw new Error(msg.includes('denied') || msg.includes('permission') ? '카메라 권한이 필요해요. 설정에서 내 화장대의 카메라 접근을 허용해주세요.' : msg);
    }
  }
  return pickFromInput(source, facing, maxSide, quality);
}

function pickFromInput(source: PhotoSource, facing: 'user' | 'environment', maxSide: number, quality: number): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (source === 'camera') input.setAttribute('capture', facing);
    input.style.display = 'none';
    document.body.appendChild(input);
    const cleanup = () => input.remove();
    input.onchange = async () => {
      const file = input.files?.[0];
      cleanup();
      if (!file) {
        resolve(null);
        return;
      }
      try {
        resolve(await resizeImage(file, maxSide, quality));
      } catch (err) {
        reject(err);
      }
    };
    // 취소는 change 가 오지 않으므로 포커스 복귀 시 정리만 한다
    window.addEventListener(
      'focus',
      () => setTimeout(() => {
        if (document.body.contains(input) && !input.files?.length) {
          cleanup();
          resolve(null);
        }
      }, 800),
      { once: true },
    );
    input.click();
  });
}

/** 앱 안 카메라(getUserMedia)를 쓸 수 있는지 */
export const canUseLiveCamera = () => typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && (window.isSecureContext || isNativeApp());
