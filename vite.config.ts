import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/lib/**",
      "**/build/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
    coverage: {
      reporter: ['lcov'],
    },
  },
});
