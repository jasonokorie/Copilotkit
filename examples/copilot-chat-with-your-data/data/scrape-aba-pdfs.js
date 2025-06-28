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
var fs = require("fs");
var path = require("path");
var node_fetch_1 = require("node-fetch");
var pdfParse = require('pdf-parse');
var _a = require('./config.js'), years = _a.years, sections = _a.sections;
var OUTPUT_PDF_DIR = path.resolve('./data/compiled_pdfs');
var OUTPUT_JSON_DIR = path.resolve('./data/compiled_json');
if (!fs.existsSync(OUTPUT_PDF_DIR))
    fs.mkdirSync(OUTPUT_PDF_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_JSON_DIR))
    fs.mkdirSync(OUTPUT_JSON_DIR, { recursive: true });
function sanitize(name) {
    return name.replace(/\s+/g, '_').replace(/[\/\\]/g, '_');
}
//function isLikelyPdf(buffer: Buffer<ArrayBufferLike>) {
//  return buffer.slice(0, 5).toString() === '%PDF-';
//}
function downloadPdf(year, section) {
    return __awaiter(this, void 0, void 0, function () {
        var sectionSlug, url, res, buffer, pdfFile, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sectionSlug = encodeURIComponent(section);
                    url = "https://www.abarequireddisclosures.org/Media/Compilation/".concat(year, "/").concat(sectionSlug, ".pdf");
                    console.log("\u2B07\uFE0F  Fetching: ".concat(url));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(url)];
                case 2:
                    res = _a.sent();
                    if (!res.ok) {
                        console.error("\u274C Failed: HTTP ".concat(res.status));
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, res.buffer()];
                case 3:
                    buffer = _a.sent();
                    pdfFile = path.join(OUTPUT_PDF_DIR, "".concat(year, "_").concat(sanitize(String(section)), ".pdf"));
                    fs.writeFileSync(pdfFile, buffer);
                    console.log("\u2705 Saved PDF: ".concat(pdfFile));
                    return [2 /*return*/, pdfFile];
                case 4:
                    err_1 = _a.sent();
                    console.error("\u274C Error downloading ".concat(year, " - ").concat(section, ":"), err_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function parsePdfToJson(pdfFile, year, section) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, data, result, jsonFile, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    buffer = fs.readFileSync(pdfFile);
                    return [4 /*yield*/, pdfParse(buffer)];
                case 1:
                    data = _a.sent();
                    result = {
                        year: year,
                        section: section,
                        text: data.text
                    };
                    jsonFile = path.join(OUTPUT_JSON_DIR, "".concat(year, "_").concat(sanitize(section), ".json"));
                    fs.writeFileSync(jsonFile, JSON.stringify(result, null, 2));
                    console.log("\u2705 Saved JSON: ".concat(jsonFile));
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.error("\u274C Failed to parse PDF: ".concat(pdfFile), err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, years_1, year, _a, sections_1, section, pdfFile;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, years_1 = years;
                    _b.label = 1;
                case 1:
                    if (!(_i < years_1.length)) return [3 /*break*/, 8];
                    year = years_1[_i];
                    _a = 0, sections_1 = sections;
                    _b.label = 2;
                case 2:
                    if (!(_a < sections_1.length)) return [3 /*break*/, 7];
                    section = sections_1[_a];
                    console.log("\n\uD83C\uDFAF Year: ".concat(year, ", Section: ").concat(section));
                    return [4 /*yield*/, downloadPdf(year, section)];
                case 3:
                    pdfFile = _b.sent();
                    if (!pdfFile) return [3 /*break*/, 5];
                    return [4 /*yield*/, parsePdfToJson(pdfFile, year, section)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    console.error("\u26A0\uFE0F  Skipped parsing due to failed download: ".concat(year, " - ").concat(section));
                    _b.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 2];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8:
                    console.log('\n✅ All done!');
                    return [2 /*return*/];
            }
        });
    });
}
main();
