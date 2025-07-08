import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    // 프로덕션 빌드 시 terser 옵션 설정
    minify: "terser",
    terserOptions: {
      compress: {
        // console.log 제거
        drop_console: true,
        // debugger 제거
        drop_debugger: true,
      },
    },
  },
});

declare global {
  interface Window {
    ENV: any;
    
  }
}