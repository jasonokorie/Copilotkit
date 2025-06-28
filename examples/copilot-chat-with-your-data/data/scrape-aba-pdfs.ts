// scrape-aba-pdfs.ts
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
const pdf = require('pdf-parse');

const ABA_URL = 'https://www.abarequireddisclosures.org/';


async function extractScholarshipData(text: string) {
  const lines = text.split('\n');
  const result: any = {};

  for (const line of lines) {
    if (line.includes('Full Tuition')) {
      const match = line.match(/Full Tuition\s+(\d+)/);
      if (match) result.full_tuition = Number(match[1]);
    }

    if (line.includes('Half Tuition')) {
      const match = line.match(/Half Tuition\s+(\d+)/);
      if (match) result.half_tuition = Number(match[1]);
    }

    if (line.includes('No Scholarship')) {
      const match = line.match(/No Scholarship\s+(\d+)/);
      if (match) result.no_scholarship = Number(match[1]);
    }
  }

  return result;
}

async function scrapeABAPDFs() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
  acceptDownloads: true // 👈 allows Playwright to intercept native file downloads
});
  const page = await context.newPage();
  
  await page.goto(ABA_URL);

  // 1. Go to the 509 Required Disclosure page
  await page.click('text="509 Required Disclosure"'); // triggers initial search

  // -- 1. open the Compilation panel (same as before) -----------------------
  
  await page.waitForSelector('text=COMPILATION - ALL SCHOOLS DATA', { timeout: 10_000 });
  
  await page.click('text=COMPILATION - ALL SCHOOLS DATA');

  // -- 2. pick the Compilation-year  ------------------------------------------
  // a) by DOM position (0-based index) …
  await page.locator('select[aria-label="year select"]').nth(1).selectOption('2023');

  const year = '2023';

  //    – or –
  //
  // b) by scoping to its wrapper <div class="compyearinput"> …
  await page.selectOption('div.compyearinput select', year);

  // ---------- 3. wait until the Section dropdown is populated ----------------
  
  // 3️⃣ Wait until the Section dropdown is populated
  await page.waitForSelector(
    'div.compSectioninput select option:not([value=""])',
    { state: 'attached', timeout: 15_000 }   // ⬅️ changed line
  );

  const section = 'Grants and Scholarships';

  // 4️⃣ Choose the desired section
  await page.selectOption('div.compSectioninput select', { value: section });

  // ---------- 5. generate & fetch the PDF as before --------------------------
  // Track the PDF URL request
  // ✅ Wait for the download triggered by the button
  const [ download ] = await Promise.all([
    page.waitForEvent('download'), // 👈 NEW
    page.click('div.compbtn button:has-text("Generate Report")')
  ]);

  // 💾 Save the file to disk
  const outputDir = path.join(__dirname, 'compiled_pdfs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  // Ensure the output directory exists
  const filePath = path.join(outputDir, `${year}_${section.replace(/\s+/g, "_")}.pdf`);
  await download.saveAs(filePath);
  console.log(`✅ Saved PDF to: ${filePath}`);

  // ✅ Read the saved PDF into a buffer
const pdfBuffer = fs.readFileSync(filePath);

const stats = fs.statSync(filePath);
if (stats.size < 1000) {
  console.error(`❌ PDF file is too small, likely empty or not downloaded correctly. Skipping: ${filePath}`);
  return; // Skip processing this file
}

//Check for proper PDF header
const header = pdfBuffer.toString().slice(0, 5);
if (header !== '%PDF-') {
  console.error(`❌ Invalid PDF file format: ${filePath}`);
  return; // Skip processing this file
}

// ✅ Extract text using pdf-parse
try {
  const pdfData = await pdf(pdfBuffer);
  console.log("📝 Extracted Text:", pdfData.text);

  const parsedJson = {
    year,
    section,
    data: extractScholarshipData(pdfData.text)
  };

  console.log("✅ Parsed JSON:", JSON.stringify(parsedJson, null, 2));

  // ✅ Optionally: save JSON to disk too!
  const jsonFilePath = filePath.replace('.pdf', '.json');
  fs.writeFileSync(jsonFilePath, JSON.stringify(parsedJson, null, 2));
  console.log(`✅ Saved JSON to: ${jsonFilePath}`);
} catch (error) {
  console.error(`❌ Error parsing PDF:`, error);

} 

// ✅ Convert to structured JSON




  await browser.close();
}

scrapeABAPDFs();