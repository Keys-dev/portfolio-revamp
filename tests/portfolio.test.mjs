import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { readFile, access } from "node:fs/promises";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
const projects = JSON.parse(
  await readFile(new URL("../src/data/projects.json", import.meta.url), "utf8"),
);
let server, App;
before(async () => {
  server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  App = (await server.ssrLoadModule("/src/App.tsx")).default;
});
after(async () => {
  await server?.close();
});
function render(path) {
  return renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: [path] },
      React.createElement(App),
    ),
  );
}
test("all preserved projects have unique stable IDs, routes, and available image files", async () => {
  assert.equal(projects.length, 4);
  assert.deepEqual(
    new Set(projects.map((p) => p.id)),
    new Set(["1", "2", "3", "4"]),
  );
  assert.equal(new Set(projects.map((p) => p.slug)).size, 4);
  for (const project of projects) {
    assert.equal(new URL(project.link).protocol, "https:");
    for (const file of new Set([
      project.cover,
      ...project.screens.map((s) => s.file),
    ]))
      await access(new URL(`../public/images/${file}`, import.meta.url));
  }
});
test("homepage exposes all project routes, contact and the work anchor", () => {
  const html = render("/");
  assert.match(html, /id="work"/);
  assert.match(html, /Muhammed/);
  for (const project of projects)
    assert.ok(html.includes(`/projects/${project.slug}`));
  assert.ok(html.includes("mailto:muhammadagbaje85@gmail.com"));
});
test("each project route renders the correct title and live URL", () => {
  for (const project of projects) {
    const html = render(`/projects/${project.slug}`);
    assert.ok(html.includes(project.title));
    assert.ok(html.includes(project.link));
    assert.ok(html.includes("The project"));
  }
});
test("unknown slug and unknown route render a usable fallback", () => {
  for (const route of ["/projects/missing", "/missing"]) {
    const html = render(route);
    assert.ok(html.includes("Nothing here."));
    assert.ok(html.includes("Back to my work"));
  }
});
test("about and contact routes remain available", () => {
  assert.ok(render("/about").includes("Web development"));
  assert.ok(render("/contact").includes("Copy email"));
});
