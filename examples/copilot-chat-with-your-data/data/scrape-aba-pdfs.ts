// scrape-aba-pdfs.ts
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const ABA_URL = 'https://www.abarequireddisclosures.org/';

async function scrapeABAPDFs() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(ABA_URL);

  // 1. Search for schools (you can customize search logic later)
  await page.click('text="Submit"'); // triggers initial search

  // 2. Wait for the table to load
  await page.waitForSelector('#mainContent');

  // 3. Extract rows of the law school results
  const schoolLinks = await page.$$eval('table a[href*="Disclosure509"]', links =>
    links.map(link => ({
      name: (link as HTMLAnchorElement).textContent?.trim() || '',
      url: (link as HTMLAnchorElement).href,
    }))
  );

  const outputDir = path.join(__dirname, 'pdfs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log('Created pdfs folder at:', outputDir);
  } else {
    console.log('pdfs folder already exists at:', outputDir);
  }

  for (const school of schoolLinks) {
    console.log(`Fetching PDFs for: ${school.name}`);
    await page.goto(school.url);

    // Find and download 509, Employment Outcomes, and Bar Passage PDFs
    const pdfTypes = {
      'Standard 509 Information Report': '509',
      'Employment Outcomes': 'employment',
      'Bar Passage Outcomes': 'barpassage',
    };

    for (const [label, slug] of Object.entries(pdfTypes)) {
      try {
        const link = await page.$(`a:has-text("${label}")`);
        if (link) {
          const pdfUrl = await link.getAttribute('href');
          if (pdfUrl) {
            const pdfResp = await page.goto(pdfUrl);
            const buffer = await pdfResp?.body();
            const filename = `${school.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}_${slug}.pdf`;
            fs.writeFileSync(path.join(outputDir, filename), buffer!);
            console.log(`Saved: ${filename}`);
          }
        }
      } catch (err) {
        console.warn(`Failed to download ${label} for ${school.name}`);
      }
    }
  }

  await browser.close();
}

scrapeABAPDFs();
