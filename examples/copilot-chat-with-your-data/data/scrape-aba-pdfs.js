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
var ABA_URL = 'https://www.abarequireddisclosures.org/';
function scrapeABAPDFs() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, schoolLinks, outputDir, _i, schoolLinks_1, school, pdfTypes, _a, _b, _c, label, slug, link, pdfUrl, pdfResp, buffer, filename, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, playwright_1.chromium.launch()];
                case 1:
                    browser = _d.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _d.sent();
                    return [4 /*yield*/, page.goto(ABA_URL)];
                case 3:
                    _d.sent();
                    // 1. Search for schools (you can customize search logic later)
                    return [4 /*yield*/, page.click('text="Submit"')];
                case 4:
                    // 1. Search for schools (you can customize search logic later)
                    _d.sent(); // triggers initial search
                    // 2. Wait for the table to load
                    return [4 /*yield*/, page.waitForSelector('#mainContent')];
                case 5:
                    // 2. Wait for the table to load
                    _d.sent();
                    return [4 /*yield*/, page.$$eval('table a[href*="Disclosure509"]', function (links) {
                            return links.map(function (link) {
                                var _a;
                                return ({
                                    name: ((_a = link.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                                    url: link.href,
                                });
                            });
                        })];
                case 6:
                    schoolLinks = _d.sent();
                    outputDir = path.join(__dirname, 'pdfs');
                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir);
                        console.log('Created pdfs folder at:', outputDir);
                    }
                    else {
                        console.log('pdfs folder already exists at:', outputDir);
                    }
                    _i = 0, schoolLinks_1 = schoolLinks;
                    _d.label = 7;
                case 7:
                    if (!(_i < schoolLinks_1.length)) return [3 /*break*/, 19];
                    school = schoolLinks_1[_i];
                    console.log("Fetching PDFs for: ".concat(school.name));
                    return [4 /*yield*/, page.goto(school.url)];
                case 8:
                    _d.sent();
                    pdfTypes = {
                        'Standard 509 Information Report': '509',
                        'Employment Outcomes': 'employment',
                        'Bar Passage Outcomes': 'barpassage',
                    };
                    _a = 0, _b = Object.entries(pdfTypes);
                    _d.label = 9;
                case 9:
                    if (!(_a < _b.length)) return [3 /*break*/, 18];
                    _c = _b[_a], label = _c[0], slug = _c[1];
                    _d.label = 10;
                case 10:
                    _d.trys.push([10, 16, , 17]);
                    return [4 /*yield*/, page.$("a:has-text(\"".concat(label, "\")"))];
                case 11:
                    link = _d.sent();
                    if (!link) return [3 /*break*/, 15];
                    return [4 /*yield*/, link.getAttribute('href')];
                case 12:
                    pdfUrl = _d.sent();
                    if (!pdfUrl) return [3 /*break*/, 15];
                    return [4 /*yield*/, page.goto(pdfUrl)];
                case 13:
                    pdfResp = _d.sent();
                    return [4 /*yield*/, (pdfResp === null || pdfResp === void 0 ? void 0 : pdfResp.body())];
                case 14:
                    buffer = _d.sent();
                    filename = "".concat(school.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_'), "_").concat(slug, ".pdf");
                    fs.writeFileSync(path.join(outputDir, filename), buffer);
                    console.log("Saved: ".concat(filename));
                    _d.label = 15;
                case 15: return [3 /*break*/, 17];
                case 16:
                    err_1 = _d.sent();
                    console.warn("Failed to download ".concat(label, " for ").concat(school.name));
                    return [3 /*break*/, 17];
                case 17:
                    _a++;
                    return [3 /*break*/, 9];
                case 18:
                    _i++;
                    return [3 /*break*/, 7];
                case 19: return [4 /*yield*/, browser.close()];
                case 20:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
scrapeABAPDFs();
