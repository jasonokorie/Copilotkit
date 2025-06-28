"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// scrape-aba-pdfs.ts
var playwright_1 = require("playwright");
var fs = require("fs");
var path = require("path");
var pdf = require('pdf-parse');
var ABA_URL = 'https://www.abarequireddisclosures.org/';
function extractScholarshipData(text) {
    return __awaiter(this, void 0, void 0, function () {
        var lines, result, _i, lines_1, line, match, match, match;
        return __generator(this, function (_a) {
            lines = text.split('\n');
            result = {};
            for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                line = lines_1[_i];
                if (line.includes('Full Tuition')) {
                    match = line.match(/Full Tuition\s+(\d+)/);
                    if (match)
                        result.full_tuition = Number(match[1]);
                }
                if (line.includes('Half Tuition')) {
                    match = line.match(/Half Tuition\s+(\d+)/);
                    if (match)
                        result.half_tuition = Number(match[1]);
                }
                if (line.includes('No Scholarship')) {
                    match = line.match(/No Scholarship\s+(\d+)/);
                    if (match)
                        result.no_scholarship = Number(match[1]);
                }
            }
            return [2 /*return*/, result];
        });
    });
}
function scrapeABAPDFs() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, page, year, section, download, outputDir, filePath, pdfBuffer, stats, header, pdfData, parsedJson, jsonFilePath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch({ headless: false })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newContext({
                            acceptDownloads: true // 👈 allows Playwright to intercept native file downloads
                        })];
                case 2:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(ABA_URL)];
                case 4:
                    _a.sent();
                    // 1. Go to the 509 Required Disclosure page
                    return [4 /*yield*/, page.click('text="509 Required Disclosure"')];
                case 5:
                    // 1. Go to the 509 Required Disclosure page
                    _a.sent(); // triggers initial search
                    // -- 1. open the Compilation panel (same as before) -----------------------
                    return [4 /*yield*/, page.waitForSelector('text=COMPILATION - ALL SCHOOLS DATA', { timeout: 10000 })];
                case 6:
                    // -- 1. open the Compilation panel (same as before) -----------------------
                    _a.sent();
                    return [4 /*yield*/, page.click('text=COMPILATION - ALL SCHOOLS DATA')];
                case 7:
                    _a.sent();
                    // -- 2. pick the Compilation-year  ------------------------------------------
                    // a) by DOM position (0-based index) …
                    return [4 /*yield*/, page.locator('select[aria-label="year select"]').nth(1).selectOption('2023')];
                case 8:
                    // -- 2. pick the Compilation-year  ------------------------------------------
                    // a) by DOM position (0-based index) …
                    _a.sent();
                    year = '2023';
                    //    – or –
                    //
                    // b) by scoping to its wrapper <div class="compyearinput"> …
                    return [4 /*yield*/, page.selectOption('div.compyearinput select', year)];
                case 9:
                    //    – or –
                    //
                    // b) by scoping to its wrapper <div class="compyearinput"> …
                    _a.sent();
                    // ---------- 3. wait until the Section dropdown is populated ----------------
                    // 3️⃣ Wait until the Section dropdown is populated
                    return [4 /*yield*/, page.waitForSelector('div.compSectioninput select option:not([value=""])', { state: 'attached', timeout: 15000 } // ⬅️ changed line
                        )];
                case 10:
                    // ---------- 3. wait until the Section dropdown is populated ----------------
                    // 3️⃣ Wait until the Section dropdown is populated
                    _a.sent();
                    section = 'Grants and Scholarships';
                    // 4️⃣ Choose the desired section
                    return [4 /*yield*/, page.selectOption('div.compSectioninput select', { value: section })];
                case 11:
                    // 4️⃣ Choose the desired section
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            page.waitForEvent('download'), // 👈 NEW
                            page.click('div.compbtn button:has-text("Generate Report")')
                        ])];
                case 12:
                    download = (_a.sent())[0];
                    outputDir = path.join(__dirname, 'compiled_pdfs');
                    if (!fs.existsSync(outputDir))
                        fs.mkdirSync(outputDir);
                    filePath = path.join(outputDir, "".concat(year, "_").concat(section.replace(/\s+/g, "_"), ".pdf"));
                    return [4 /*yield*/, download.saveAs(filePath)];
                case 13:
                    _a.sent();
                    console.log("\u2705 Saved PDF to: ".concat(filePath));
                    pdfBuffer = fs.readFileSync(filePath);
                    stats = fs.statSync(filePath);
                    if (stats.size < 1000) {
                        console.error("\u274C PDF file is too small, likely empty or not downloaded correctly. Skipping: ".concat(filePath));
                        return [2 /*return*/]; // Skip processing this file
                    }
                    header = pdfBuffer.toString().slice(0, 5);
                    if (header !== '%PDF-') {
                        console.error("\u274C Invalid PDF file format: ".concat(filePath));
                        return [2 /*return*/]; // Skip processing this file
                    }
                    _a.label = 14;
                case 14:
                    _a.trys.push([14, 16, , 17]);
                    return [4 /*yield*/, pdf(pdfBuffer)];
                case 15:
                    pdfData = _a.sent();
                    console.log("📝 Extracted Text:", pdfData.text);
                    parsedJson = {
                        year: year,
                        section: section,
                        data: extractScholarshipData(pdfData.text)
                    };
                    console.log("✅ Parsed JSON:", JSON.stringify(parsedJson, null, 2));
                    jsonFilePath = filePath.replace('.pdf', '.json');
                    fs.writeFileSync(jsonFilePath, JSON.stringify(parsedJson, null, 2));
                    console.log("\u2705 Saved JSON to: ".concat(jsonFilePath));
                    return [3 /*break*/, 17];
                case 16:
                    error_1 = _a.sent();
                    console.error("\u274C Error parsing PDF:", error_1);
                    return [3 /*break*/, 17];
                case 17: 
                // ✅ Convert to structured JSON
                return [4 /*yield*/, browser.close()];
                case 18:
                    // ✅ Convert to structured JSON
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
scrapeABAPDFs();
