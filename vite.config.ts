import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

import Components from "@uni-helper/vite-plugin-uni-components";
import { WotResolver } from "@uni-helper/vite-plugin-uni-components/resolvers";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const UnoCss = await import("unocss/vite").then((i) => i.default);

  return {
    plugins: [
      Components({
        resolvers: [WotResolver()],
      }),
      uni(),
      UnoCss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true, // Suppress deprecation warnings from dependencies
        },
      },
    },
  };
});
