const fs = require("fs");
const path = require("path");

const tokens = JSON.parse(fs.readFileSync("tokens/tokens.json", "utf8"));

// ── Generate CSS Variables ──
let css = `/* Auto-generated from tokens.json — do not edit manually */
/* Run: npm run tokens:build */

@layer base {
  :root {
`;

for (const [key, tok] of Object.entries(tokens.light)) {
  const val = tok.value.replace("hsl(", "").replace(")", "");
  css += `    --${key}: ${val};\n`;
}

// Add global tokens (radius, etc.)
for (const [key, tok] of Object.entries(tokens.global)) {
  css += `    --${key}: ${tok.value};\n`;
}

css += `  }\n\n  .dark {\n`;

for (const [key, tok] of Object.entries(tokens.dark)) {
  const val = tok.value.replace("hsl(", "").replace(")", "");
  css += `    --${key}: ${val};\n`;
}

css += `  }\n}\n`;

// Ensure output dir exists
const outDir = path.join("src", "styles");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "tokens.css"), css);
console.log("✅ src/styles/tokens.css generated");

// ── Generate Tailwind token extension ──
const tailwindTokens = {
  colors: {},
  borderRadius: {},
};

for (const key of Object.keys(tokens.light)) {
  tailwindTokens.colors[key] = `hsl(var(--${key}))`;
}
for (const [key, tok] of Object.entries(tokens.global)) {
  if (tok.type === "borderRadius") {
    tailwindTokens.borderRadius[
      key.replace("radius-", "").replace("radius", "DEFAULT")
    ] = `var(--${key})`;
  }
}

const twOutput = `// Auto-generated from tokens.json — do not edit manually
// Run: npm run tokens:build
module.exports = ${JSON.stringify(tailwindTokens, null, 2)};\n`;

fs.writeFileSync(path.join("tokens", "tailwind-tokens.js"), twOutput);
console.log("✅ tokens/tailwind-tokens.js generated");
console.log("\n🎉 Token build complete!");
