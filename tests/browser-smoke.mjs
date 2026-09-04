import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const origin = "http://127.0.0.1:4173";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const artifacts = fileURLToPath(new URL("../artifacts/browser/", import.meta.url));
const preview = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4173",
    "--strictPort",
  ],
  { stdio: ["ignore", "pipe", "pipe"] },
);

let previewOutput = "";
preview.stdout.on("data", (chunk) => (previewOutput += chunk));
preview.stderr.on("data", (chunk) => (previewOutput += chunk));

async function waitForPreview() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview did not start.\n${previewOutput}`);
}

const browserErrors = [];
let browser;

try {
  await mkdir(artifacts, { recursive: true });
  await waitForPreview();
  browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin,
  });
  const startupPage = await context.newPage();
  await startupPage.goto(origin, { waitUntil: "networkidle" });
  const startupResources = await startupPage.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => entry.name),
  );
  assert.equal(startupResources.some((url) => /Gallery-.*\.js/.test(url)), false);
  const nonCoverScreens = [
    "vitalsyncscr2.png", "vitalsyncscr3.png", "temposcr1.png", "temposcr3.png",
    "pokedexscr2.png", "pokedexscr3.png", "objetscr2.png", "objetscr3.png",
  ];
  assert.equal(
    startupResources.some((url) => nonCoverScreens.some((file) => url.endsWith(file))),
    false,
  );
  await startupPage.close();
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  // Cold loads, route metadata, and browser history.
  await page.goto(`${origin}/projects/vitalsync`, { waitUntil: "networkidle" });
  await assert.doesNotReject(() => page.getByRole("heading", { name: "VitalSync." }).waitFor());
  assert.equal(await page.title(), "VitalSync — Muhammed Agbaje");
  await page.goto(`${origin}/missing`, { waitUntil: "networkidle" });
  assert.equal(await page.title(), "Page not found — Muhammed Agbaje");
  await page.getByRole("link", { name: "Back to my work" }).click();
  await page.waitForURL(`${origin}/#work`);
  assert.equal(await page.evaluate(() => document.activeElement?.id), "work");
  await page.goBack();
  assert.equal(new URL(page.url()).pathname, "/missing");
  await page.goForward();
  assert.equal(new URL(page.url()).hash, "#work");

  // Mobile Sheet: focus containment, Escape/return, link close, and breakpoint close.
  const menuButton = page.getByRole("button", { name: "Open navigation" });
  await menuButton.click();
  await assert.doesNotReject(() => page.getByRole("dialog").waitFor());
  assert.equal(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null), true);
  await page.keyboard.press("Escape");
  await assert.doesNotReject(() => menuButton.waitFor({ state: "visible" }));
  assert.equal(await menuButton.evaluate((element) => element === document.activeElement), true);
  await menuButton.click();
  await page.getByRole("dialog").getByRole("link", { name: /About/ }).click();
  await page.waitForURL(`${origin}/about`);
  assert.equal(await page.getByRole("dialog").count(), 0);
  await menuButton.click();
  await page.setViewportSize({ width: 820, height: 900 });
  await page.waitForTimeout(100);
  assert.equal(await page.getByRole("dialog").count(), 0);

  // Accordion keyboard behavior.
  const webSkill = page.getByRole("button", { name: /Web development/ });
  const mobileSkill = page.getByRole("button", { name: /Mobile development/ });
  await webSkill.focus();
  await page.keyboard.press("ArrowDown");
  assert.equal(await mobileSkill.evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Enter");
  assert.equal(await mobileSkill.getAttribute("aria-expanded"), "true");

  // Copy-email success and failure feedback.
  await page.goto(`${origin}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Copy email" }).click();
  await assert.doesNotReject(() => page.getByText("Email copied").waitFor());
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Denied for test")) },
    });
  });
  await page.getByRole("button", { name: "Copy email" }).click();
  await assert.doesNotReject(() => page.getByText(/Could not copy/).waitFor());

  // Dialog and Carousel state, keyboard activation, reset between projects.
  await page.goto(`${origin}/#work`, { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 390, height: 844 });
  const vitalPreview = page.getByRole("button", { name: "Preview VitalSync screenshots" });
  await vitalPreview.click();
  let dialog = page.getByRole("dialog");
  await assert.doesNotReject(() => dialog.getByText("01 / 03").waitFor());
  const previous = dialog.getByRole("button", { name: "Previous slide" });
  const next = dialog.getByRole("button", { name: "Next slide" });
  assert.equal(await previous.isDisabled(), true);
  await next.focus();
  await page.keyboard.press("Enter");
  await assert.doesNotReject(() => dialog.getByText("02 / 03").waitFor());
  await next.click();
  await assert.doesNotReject(() => dialog.getByText("03 / 03").waitFor());
  assert.equal(await next.isDisabled(), true);
  assert.match(await dialog.getByRole("link", { name: /Full size/ }).getAttribute("href"), /vitalsyncscr3\.png$/);
  await page.keyboard.press("Escape");
  assert.equal(await vitalPreview.evaluate((element) => element === document.activeElement), true);
  await page.getByRole("button", { name: "Preview Tempo screenshots" }).click();
  dialog = page.getByRole("dialog");
  await assert.doesNotReject(() => dialog.getByText("01 / 03").waitFor());
  await page.keyboard.press("Escape");

  // Required representative widths, short landscape, larger text/zoom, and overflow.
  const sizes = [
    [320, 700], [360, 780], [390, 844], [430, 900], [768, 900],
    [820, 900], [1024, 768], [1280, 900], [1440, 1000], [1920, 1080],
    [768, 420],
  ];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto(origin, { waitUntil: "networkidle" });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      true,
      `Horizontal overflow at ${width}x${height}`,
    );
  }
  await page.setViewportSize({ width: 720, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "";
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${artifacts}home-mobile.png`, fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${artifacts}home-desktop.png`, fullPage: true });

  assert.deepEqual(browserErrors, []);
  console.log(
    `Browser smoke checks passed at 11 viewport sizes; ${startupResources.length} startup requests, no gallery chunk or non-cover screenshots; screenshots saved to artifacts/browser/.`,
  );
} finally {
  await browser?.close();
  preview.kill();
}
