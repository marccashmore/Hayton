import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// outDir is "build" to match the Azure Static Web Apps workflow (output_location: build)
export default defineConfig({
  plugins: [react()],
  build: { outDir: "build" },
});
