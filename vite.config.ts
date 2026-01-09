import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],

  ssr: {
    noExternal: [/^@syncfusion\//],
  },

  optimizeDeps: {
    include: [
      "@syncfusion/ej2-react-base",
      "@syncfusion/ej2-react-grids",
      "@syncfusion/ej2-react-charts",
      "@syncfusion/ej2-react-dropdowns",
      "@syncfusion/ej2-react-maps",
      "@syncfusion/ej2-react-buttons",
      "@syncfusion/ej2-base",
    ],
  },
});
