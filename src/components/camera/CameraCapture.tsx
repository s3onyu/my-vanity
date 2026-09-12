import { useCallback, useEffect, useRef, useState } from 'react';
import { FACE_GUIDE } from '@/engine/skinPhoto';
import { canUseLiveCamera, capturePhoto } from '@/lib/camera';
import { Icon } from '@/components/ui/Icon';

export type GuideKind = 'face' | 'product';

interface Props {
  guide: GuideKind;
  title: string;
  /** 촬영·선택된 사진 (data URL) */
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
  /** 긴 변 px */
  maxSide?: number;
}

const TIPS: Record<GuideKind, string[]> = {
  face: ['화장을 지운 맨얼굴로', '창가처럼 밝고 고른 빛 아래에서', '얼굴을 타원 안에 꽉 채우고 정면을 봐요', '매번 비슷한 거리와 시간에 찍으면 비교가 정확해져요'],
  product: ['브랜드와 제품명이 보이는 앞면을', '네모 안에 맞춰 정면으로', '반사되는 빛은 살짝 비켜서'],
};

/**
 * 앱 안 카메라 — 미리보기 위에 가이드(얼굴 타원 / 제품 네모)를 겹쳐 같은 구도로 찍게 한다.
 * getUserMedia 를 못 쓰거나 거부되면 기기 카메라(네이티브 플러그인 또는 파일 입력)로 대신한다.
 */
export function CameraCapture({ guide, title, onCapture, onClose, maxSide = 1280 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<'user' | 'environment'>(guide === 'face' ? 'user' : 'environment');
  const [status, setStatus] = useState<'starting' | 'live' | 'unavailable'>(canUseLiveCamera() ? 'starting' : 'unavailable');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!canUseLiveCamera()) return undefined;
    let cancelled = false;
    setStatus('starting');
    setError(null);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play().catch(() => undefined);
        }
        setStatus('live');
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setStatus('unavailable');
        setError(err.name === 'NotAllowedError' ? '카메라 접근이 거부됐어요. 아래 버튼으로 기기 카메라를 쓰거나 설정에서 권한을 허용해주세요.' : '앱 안 카메라를 열 수 없어요. 아래 버튼으로 기기 카메라를 써주세요.');
      });
    return () => {
      cancelled = true;
      stop();
    };
  }, [facing, stop]);

  const shoot = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const scale = Math.min(1, maxSide / Math.max(video.videoWidth, video.videoHeight));
    const w = Math.round(video.videoWidth * scale);
    const h = Math.round(video.videoHeight * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // 전면 카메라 미리보기는 거울처럼 보여주지만, 저장은 실제 방향 그대로 (비교 일관성)
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    stop();
    onCapture(dataUrl);
  };

  const fallback = async (source: 'camera' | 'gallery') => {
    setBusy(true);
    setError(null);
    try {
      const url = await capturePhoto({ source, facing, maxSide });
      if (url) {
        stop();
        onCapture(url);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const g = FACE_GUIDE;

  return (
    <div className="cam" role="dialog" aria-modal="true" aria-label={title}>
      <div className="cam__top">
        <button type="button" className="icon-btn cam__btn" onClick={onClose} aria-label="닫기">
          <Icon name="close" />
        </button>
        <div className="h3 flex-1 text-center" style={{ color: '#fff' }}>
          {title}
        </div>
        {status === 'live' && (
          <button type="button" className="icon-btn cam__btn" onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))} aria-label="카메라 전환">
            ⟲
          </button>
        )}
      </div>

      <div className="cam__stage">
        {status !== 'unavailable' && (
          <video ref={videoRef} className={`cam__video${facing === 'user' ? ' is-mirrored' : ''}`} autoPlay playsInline muted />
        )}
        {status === 'starting' && <div className="cam__placeholder">카메라 여는 중…</div>}
        {status === 'unavailable' && (
          <div className="cam__placeholder">
            <Icon name="camera" size={32} />
            <span className="small">앱 안 카메라를 쓸 수 없어요</span>
          </div>
        )}
        {status === 'live' && (
          <svg className="cam__guide" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <mask id="cam-mask">
                <rect width="100" height="100" fill="#fff" />
                {guide === 'face' ? (
                  <ellipse cx={g.cx * 100} cy={g.cy * 100} rx={g.rx * 100} ry={g.ry * 100} fill="#000" />
                ) : (
                  <rect x="12" y="20" width="76" height="60" rx="3" fill="#000" />
                )}
              </mask>
            </defs>
            <rect width="100" height="100" fill="rgba(0,0,0,0.45)" mask="url(#cam-mask)" />
            {guide === 'face' ? (
              <>
                <ellipse cx={g.cx * 100} cy={g.cy * 100} rx={g.rx * 100} ry={g.ry * 100} fill="none" stroke="#fff" strokeWidth="0.6" strokeDasharray="2 1.5" vectorEffect="non-scaling-stroke" />
                <line x1={(g.cx - g.rx * 0.6) * 100} y1={(g.cy - g.ry * 0.15) * 100} x2={(g.cx + g.rx * 0.6) * 100} y2={(g.cy - g.ry * 0.15) * 100} stroke="#fff" strokeWidth="0.3" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
              </>
            ) : (
              <rect x="12" y="20" width="76" height="60" rx="3" fill="none" stroke="#fff" strokeWidth="0.6" strokeDasharray="2 1.5" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
        )}
      </div>

      <div className="cam__tips">
        {TIPS[guide].map((t) => (
          <span key={t}>· {t}</span>
        ))}
      </div>
      {error && <div className="notice notice--danger cam__error">{error}</div>}

      <div className="cam__controls">
        <button type="button" className="cam__side" onClick={() => fallback('gallery')} disabled={busy}>
          앨범
        </button>
        {status === 'live' ? (
          <button type="button" className="cam__shutter" onClick={shoot} aria-label="촬영" />
        ) : (
          <button type="button" className="btn" onClick={() => fallback('camera')} disabled={busy}>
            <Icon name="camera" size={16} /> 기기 카메라로 찍기
          </button>
        )}
        <button type="button" className="cam__side" onClick={() => fallback('camera')} disabled={busy || status !== 'live'} style={{ visibility: status === 'live' ? 'visible' : 'hidden' }}>
          기기 카메라
        </button>
      </div>
      <p className="cam__foot">사진은 서버로 보내지 않고 이 기기(또는 내 계정)에만 저장돼요.</p>
    </div>
  );
}
