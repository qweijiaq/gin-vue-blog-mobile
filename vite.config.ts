import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import type { ImportMetaEnv } from "./env";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let env: Record<keyof ImportMetaEnv, string> = loadEnv(mode, process.cwd());
  const serverUrl = env.VITE_SERVER_URL;
  const wsUrl = serverUrl.replace("http", "ws");

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5174,
      proxy: {
        "/api": {
          target: serverUrl,
          changeOrigin: true,
        },
        "/uploads": {
          target: serverUrl,
          changeOrigin: true,
        },
        "/ws": {
          target: wsUrl,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/ws/, ""),
        },
      },
    },
  };
});
