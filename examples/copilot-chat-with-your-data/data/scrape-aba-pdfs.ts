import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
const pdfParse = require('pdf-parse');
const { years, sections } = require('./config.js');


const OUTPUT_PDF_DIR = path.resolve('./data/compiled_pdfs');
const OUTPUT_JSON_DIR = path.resolve('./data/compiled_json');

if (!fs.existsSync(OUTPUT_PDF_DIR)) fs.mkdirSync(OUTPUT_PDF_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_JSON_DIR)) fs.mkdirSync(OUTPUT_JSON_DIR, { recursive: true });

function sanitize(name: string) {
  return name.replace(/\s+/g, '_').replace(/[\/\\]/g, '_');
}

function isLikelyPdf(buffer: Buffer<ArrayBufferLike>) {
  return buffer.slice(0, 5).toString() === '%PDF-';
}

async function downloadPdf(year: any, section: string | number | boolean) {
  const sectionSlug = encodeURIComponent(section);
  const url = `https://www.abarequireddisclosures.org/Media/Compilation/${year}/${sectionSlug}.pdf`;
  console.log(`⬇️  Fetching: ${url}`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ Failed: HTTP ${res.status}`);
      return null;
    }

    const buffer = await res.buffer();

    if (!isLikelyPdf(buffer)) {
      console.error(`❌ Not a valid PDF (wrong header). Skipping.`);
      return null;
    }

    const pdfFile = path.join(OUTPUT_PDF_DIR, `${year}_${sanitize(String(section))}.pdf`);
    fs.writeFileSync(pdfFile, buffer);
    console.log(`✅ Saved PDF: ${pdfFile}`);

    return pdfFile;
  } catch (err) {
    console.error(`❌ Error downloading ${year} - ${section}:`, err);
    return null;
  }
}

async function parsePdfToJson(pdfFile: fs.PathOrFileDescriptor, year: any, section: string) {
  try {
    const buffer = fs.readFileSync(pdfFile);
    const data = await pdfParse(buffer);

    const result = {
      year,
      section,
      text: data.text
    };

    const jsonFile = path.join(OUTPUT_JSON_DIR, `${year}_${sanitize(section)}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(result, null, 2));
    console.log(`✅ Saved JSON: ${jsonFile}`);
  } catch (err) {
    console.error(`❌ Failed to parse PDF: ${pdfFile}`, err);
  }
}

async function main() {
  for (const year of years) {
    for (const section of sections) {
      console.log(`\n🎯 Year: ${year}, Section: ${section}`);
      const pdfFile = await downloadPdf(year, section);
      if (pdfFile) {
        await parsePdfToJson(pdfFile, year, section);
      } else {
        console.error(`⚠️  Skipped parsing due to failed download: ${year} - ${section}`);
      }
    }
  }

  console.log('\n✅ All done!');
}

main();
