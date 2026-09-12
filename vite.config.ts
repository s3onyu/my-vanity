import { defineConfig, type Plugin } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { handleProductImage } from './api/_lib/productImage';

/**
 * 개발 서버에서 Vercel 함수(/api/product-image)를 흉내 낸다.
 * .env.local 의 NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 을 서버 쪽에서만 읽는다 (VITE_ 접두사 없음 → 브라우저 노출 안 됨).
 */
function devApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'my-vanity-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/product-image', async (req, res) => {
        const q = new URL(req.url ?? '/', 'http://localhost').searchParams.get('q');
        const { status, body } = await handleProductImage(q, { NAVER_CLIENT_ID: env.NAVER_CLIENT_ID, NAVER_CLIENT_SECRET: env.NAVER_CLIENT_SECRET });
        res.statusCode = status;
        res.setHeader('content-type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(body));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApiPlugin(env)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { port: 5173 },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  };
});
