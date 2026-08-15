import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://127.0.0.1:3002",
    trace: "on-first-retry",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3002",
    url: "http://127.0.0.1:3002/login",
    reuseExistingServer: false,
    timeout: 120_000
  }
});
