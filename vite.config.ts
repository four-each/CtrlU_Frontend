import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/friendships': {
        target: 'https://api.ctrlu.site', // 백엔드 서버의 주소
        changeOrigin: true, // 대상 서버의 출처를 변경
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': {
        target: 'https://api.ctrlu.site', // 백엔드 서버의 주소
        changeOrigin: true, // 대상 서버의 출처를 변경
      },
      '/todos': {
        target: 'https://api.ctrlu.site', // 백엔드 서버의 주소
        changeOrigin: true, // 대상 서버의 출처를 변경
      },
      '/users': {
        target: 'https://api.ctrlu.site', // 백엔드 서버의 주소
        changeOrigin: true, // 대상 서버의 출처를 변경
      },
    },
  }
});
