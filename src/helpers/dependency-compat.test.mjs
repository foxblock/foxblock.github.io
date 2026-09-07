import { afterAll, expect, test } from "vitest";
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import Image from "@11ty/eleventy-img";
import mathjaxPlugin from "markdown-it-mathjax3";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("@11ty/eleventy-img"))("sharp");
const { headerToId } = require("./utils.js");
const { isDecodableImage } = require("./imageFormat.js");
const directory = mkdtempSync(path.join(tmpdir(), "garden-dependencies-"));
const source = path.join(directory, "source.svg");
writeFileSync(source, '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#123"/></svg>');

afterAll(async () => {
  // Release libvips file handles before removing fixtures on Windows.
  sharp.cache(false);
  await rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
});

test("test_image_generation_returns_existing_decodable_files", async () => {
  const metadata = await Image(source, {
    widths: [16, 32], formats: ["webp", "jpeg"],
    outputDir: path.join(directory, "images"), urlPath: "/img/optimized",
  });
  for (const format of ["webp", "jpeg"]) {
    expect(metadata[format]).toHaveLength(2);
    for (const image of metadata[format]) {
      const decoded = await sharp(image.outputPath).metadata();
      expect(decoded.format).toBe(format);
      expect(decoded.width).toBe(image.width);
      expect(image.url).toMatch(/^\/img\/optimized\//);
    }
  }
});

test("test_favicon_plugin_works_with_patched_sharp", async () => {
  let generate;
  const outputDir = path.join(directory, "favicons");
  require("eleventy-plugin-gen-favicons")({
    addAsyncShortcode(name, callback) { generate = callback; },
  }, { outputDir, skipCache: true });
  const html = await generate(source, { appleIconBgColor: "#123" });
  expect(html).toContain('href="/favicon.svg"');
  expect(readFileSync(path.join(outputDir, "favicon.svg"), "utf8")).toBe(readFileSync(source, "utf8"));
  expect([...readFileSync(path.join(outputDir, "favicon.ico")).subarray(0, 6)]).toEqual([0, 0, 1, 0, 3, 0]);
  for (const [name, size] of [["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
    const metadata = await sharp(path.join(outputDir, name)).metadata();
    expect([metadata.width, metadata.height]).toEqual([size, size]);
  }
  const manifest = JSON.parse(readFileSync(path.join(outputDir, "manifest.webmanifest"), "utf8"));
  expect(manifest.icons.map(icon => icon.sizes)).toEqual(["192x192", "512x512"]);
});

test("test_truncated_image_keeps_original_instead_of_optimization", async () => {
  const broken = path.join(directory, "truncated.png");
  writeFileSync(broken, Buffer.from("89504e470d0a1a0a0000000000000000", "hex"));
  expect(await isDecodableImage(broken)).toBe(false);
});

test("test_heading_ids_remain_compatible", () => {
  expect(headerToId("Über Größe & C++")).toBe("ueber-groesse-and-c");
  expect(headerToId("Hello World")).toBe("hello-world");
});

test("test_math_renders_through_esm_entry", () => {
  const markdown = require("markdown-it")().use(mathjaxPlugin);
  const html = markdown.render("Inline $x^2$\n\n$$\\frac{1}{2}$$");
  expect(html).toContain("<mjx-container");
  expect(html).toContain("<svg");
  expect(require("node-html-parser").parse(html).querySelector("merror, [data-mml-node=merror]")).toBeNull();
});

test("test_component_discovery_and_logo_urls", async () => {
  const dynamics = await require("../site/_data/dynamics.js")();
  expect(dynamics.common.header).toContain("components/user/common/header/theme-switcher.njk");
  const meta = await require("../site/_data/meta.js")();
  expect(meta.siteLogoPath).toBe("/logo.svg");
  expect(meta.themeStyle).not.toContain("\\");
});
