#!/usr/bin/env node
/**
 * Fails when a spec reaches into markup instead of describing a flow.
 *
 * The suite was written twice: once against a React app painted with shadcn,
 * and once against frappe-ui. Every spec that keyed off a CSS class or a
 * library's internal `data-slot` broke on the rewrite while the feature under
 * it still worked, which is a test that costs more than it protects.
 *
 * Allowed anchors, in order of preference: a role, a label, and — where
 * frappe-ui publishes nothing to hold on to — a `data-testid` the app owns.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["e2e/tests", "e2e/helpers"];

/** `data-slot`s the app cannot avoid: frappe-ui publishes these as its contract. */
const ALLOWED_SLOTS = new Set([
  "sidebar",
  "list-row",
  "list-divider",
  "command-palette-input",
  "command-palette-item",
  "command-palette-group-label",
  "switch",
  "desktop-shell",
]);

const RULES = [
  {
    // `.locator(".foo")` / `.locator('.foo bar')` — a CSS class is styling.
    re: /\.locator\(\s*(['"`])\s*\.[^'"`]*\1/g,
    why: "CSS class selector — use a role, a label, or a data-testid",
  },
  {
    re: /:has-text\(/g,
    why: "`:has-text()` — use getByRole({ name }) or .filter({ hasText })",
  },
  {
    re: /\.locator\(\s*(['"`])\s*(?:input|button|div|span|p|tr|td)\[/g,
    why: "tag+attribute selector — use a role or a label",
  },
];

let failures = 0;
for (const root of ROOTS) {
  for (const file of readdirSync(root).filter((f) => f.endsWith(".ts"))) {
    const path = join(root, file);
    const text = readFileSync(path, "utf8");
    const lines = text.split("\n");

    lines.forEach((line, i) => {
      for (const rule of RULES) {
        rule.re.lastIndex = 0;
        if (rule.re.test(line)) {
          console.error(`${path}:${i + 1}  ${rule.why}\n    ${line.trim()}`);
          failures += 1;
        }
      }
      for (const m of line.matchAll(/data-slot=\\?["']([a-z-]+)\\?["']/g)) {
        if (!ALLOWED_SLOTS.has(m[1])) {
          console.error(
            `${path}:${i + 1}  data-slot="${m[1]}" is a library internal — ` +
              `use a role/label, or add it to ALLOWED_SLOTS if frappe-ui documents it\n    ${line.trim()}`,
          );
          failures += 1;
        }
      }
    });
  }
}

if (failures) {
  console.error(
    `\n${failures} markup-coupled locator(s). See e2e/no-markup-locators.mjs.`,
  );
  process.exit(1);
}
console.log("e2e locators: no markup coupling found");
