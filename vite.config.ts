import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Tarefa3/",
  server: {
    allowedHosts: ["fhgqf7-5173.csb.app"], // 👈 seu host do CodeSandbox
  },
});
