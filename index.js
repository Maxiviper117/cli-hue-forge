// generate-shades-from-css.js
// --------------------------------------------------------
// Parse a .css file for variables that start with "--generate-color-".
// For each variable discovered, output a @theme block that defines
// a ladder of OKLCH lightness steps named like:
//   --color-{name}-{step}
// where {step} is a lightness percentage such as 98, 95, 90, ... 10.
// --------------------------------------------------------

import fs from "node:fs";
import { Command } from "commander";
import { parse, oklch, formatHex } from "culori";

// Lightness stops (0–100). Tweak as desired.
const STEPS = [98, 95, 90, 80, 70, 60, 50, 40, 30, 20, 15, 10];

const program = new Command();
program
    .name("generate-shades-from-css")
    .description("Parse a .css file for --generate-color-* variables and output OKLCH shade ladder.")
    .requiredOption("-i, --input <file>", "Input CSS file")
    .option("-o, --oklch", "Output colors as oklch(...) instead of hex")
    .option("-f, --file <output>", "Output file (e.g. gen.css)")
    .helpOption("-h, --help", "Display help for command");

program.parse(process.argv);
const options = program.opts();
const inputPath = options.input;
const useOklch = options.oklch;
const outputFile = options.file;
let cssText;
try {
    cssText = fs.readFileSync(inputPath, "utf8");
} catch (err) {
    console.error(`Error reading file: ${inputPath}\n${err.message}`);
    process.exit(1);
}

// Match lines like: --generate-color-foo-bar: #abcd12;
const VAR_REGEX = /--generate-color-([a-z0-9_-]+)\s*:\s*([^;]+);/gi;

const seeds = {};
let match;
while ((match = VAR_REGEX.exec(cssText)) !== null) {
    const name = match[1]; // e.g. "fg-accent"
    const rawValue = match[2].trim(); // e.g. "#e6b97a" or "rgb(…)"
    seeds[name] = rawValue;
}

if (Object.keys(seeds).length === 0) {
    console.error("No --generate-color-* variables found in", inputPath);
    process.exit(1);
}

let output = "@theme {\n";

for (const [name, value] of Object.entries(seeds)) {
    const parsed = parse(value);
    const ok = oklch(parsed);
    if (!ok) {
        console.warn(`Skipping ${name}: could not parse ${value}`);
        continue;
    }

    // Generate all single shade variables first (for reference)
    const shadeVars = STEPS.map((l) => {
        const col = { ...ok, l: l / 100 };
        if (useOklch) {
            // Format as oklch(L C H)
            const lchStr = `oklch(${(col.l * 100).toFixed(2)}% ${(col.c).toFixed(4)} ${(col.h).toFixed(2)})`;
            return `  --color-${name}-${l}: ${lchStr};`;
        } else {
            return `  --color-${name}-${l}: ${formatHex(col)};`;
        }
    });
    output += shadeVars.join("\n") + "\n\n";

    // Generate light-dark pairs
    const pairs = [];
    for (let i = 0; i < Math.floor(STEPS.length / 2); i++) {
        const high = STEPS[i];
        const low = STEPS[STEPS.length - 1 - i];
        pairs.push(`  --color-${name}-${high}-${low}: light-dark(var(--color-${name}-${high}), var(--color-${name}-${low}));`);
    }
    output += pairs.join("\n") + "\n\n";
}

output += "}\n";
if (outputFile) {
    try {
        fs.writeFileSync(outputFile, output, "utf8");
        console.log(`CSS written to ${outputFile}`);
    } catch (err) {
        console.error(`Error writing to file: ${outputFile}\n${err.message}`);
        process.exit(1);
    }
} else {
    console.log(output);
}
