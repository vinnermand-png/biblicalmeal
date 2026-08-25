#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'src/data/editorial-images.json');
const DEFAULT_MODEL = 'gpt-image-2';
const MASTER_STYLE = `BiblicalMeal canonical editorial image direction: premium editorial food photography for a modern historical publication exploring food, scripture and the ancient Mediterranean table. Realistic photography, warm natural daylight, soft honest shadows, aged limestone, handmade clay, natural linen, olive wood, subtle earthenware, tactile imperfections, restrained composition and refined negative space. Timeless Mediterranean and Levantine material atmosphere. The image must sit naturally beside warm parchment, deep olive, terracotta and restrained gold, and support elegant Fraunces editorial typography without competing with it. Avoid visible modern objects, plastic, stainless steel, modern kitchens, modern packaging, neon, logos, watermarks, readable text, fantasy biblical scenes, halos, religious kitsch, artificial-looking people, exaggerated smoke, oversaturation, hyper-polished advertising symmetry and generic stock photography.`;

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const selectedIds = args
  .filter((arg, index) => args[index - 1] === '--id')
  .filter(Boolean);

if (has('--help')) {
  console.log(
    `Usage:\n  npm run images:generate -- --pilot\n  npm run images:generate -- --id journal-ancient-table\n  npm run images:generate -- --all\n  npm run images:generate -- --all --force\n\nThe command is manual, development-time only, and never runs during the public site runtime.`,
  );
  process.exit(0);
}

const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
let selected;
if (has('--pilot')) {
  selected = manifest.filter((asset) =>
    ['ingredients-figs-still-life', 'journal-ancient-table'].includes(asset.id),
  );
} else if (has('--all')) {
  selected = manifest;
} else if (selectedIds.length > 0) {
  selected = manifest.filter((asset) => selectedIds.includes(asset.id));
} else {
  console.error(
    'Select --pilot, --id <asset-id>, or --all. No images were generated.',
  );
  process.exit(1);
}

if (selected.length === 0) {
  console.error('No manifest assets matched the requested selection.');
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error(
    'OPENAI_API_KEY is required locally. The public website never reads this value.',
  );
  process.exit(1);
}

const model = process.env.OPENAI_IMAGE_MODEL || DEFAULT_MODEL;
const force = has('--force');

for (const asset of selected) {
  const outputPath = path.join(ROOT, asset.output);
  let exists = false;

  try {
    await access(outputPath, constants.F_OK);
    exists = true;
  } catch {
    // A missing output is expected when generating an asset for the first time.
  }

  if (exists && !force) {
    console.log(
      `Skipping ${asset.id}: ${asset.output} already exists. Use --force to regenerate.`,
    );
    continue;
  }

  const prompt = `${MASTER_STYLE}\n\nAsset-specific direction:\n${asset.promptSubject}`;
  console.log(`Generating ${asset.id} with ${model}...`);

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      size: asset.size,
      quality: asset.quality,
      output_format: 'webp',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `OpenAI image generation failed for ${asset.id}: ${response.status} ${body}`,
    );
  }

  const payload = await response.json();
  const imageBase64 = payload?.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new Error(`OpenAI returned no base64 image payload for ${asset.id}.`);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.from(imageBase64, 'base64'));

  asset.status = 'generated';
  asset.generatedAt = new Date().toISOString();
  console.log(`Saved ${asset.output}`);
}

await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  'Editorial image manifest updated. Review generated files before committing them.',
);
