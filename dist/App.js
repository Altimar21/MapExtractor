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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const MAXZOOM = 2;
const MINZOOM = 0;
const ZOOMWARN = 13;
const URLMAP = `https://tile.openstreetmap.org/`;
const delayMs = 1000;
let totalCounter = 0;
let zoomCounter = 0;
let currentDir = `${__dirname}/..`;
const delay = (delayInms) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`MapExtractor starting ...`);
    console.log(`MapExtractor MINZOOM = ${MINZOOM}`);
    console.log(`MapExtractor MAXZOOM = ${MAXZOOM}`);
    console.log(`MapExtractor ZOOMWARN = ${ZOOMWARN}`);
    console.log(`MapExtractor URLMAP = ${URLMAP}`);
    yield createFolder();
    for (let z = MINZOOM; z <= MAXZOOM; z++) {
        yield promises_1.default.mkdir(`${currentDir}/${z}`);
        console.log(`Starting zoom ${z}.`);
        zoomCounter = 0;
        for (let y = 0; y < Math.pow(2, z); y++) {
            yield promises_1.default.mkdir(`${currentDir}/${z}/${y}`);
            for (let x = 0; x < Math.pow(2, z); x++) {
                console.log(`Searching ${URLMAP}${z}/${y}/${x}`);
                yield delay(delayMs);
                axios_1.default
                    .get(`${URLMAP}${z}/${y}/${x}.png`, { responseType: "arraybuffer" })
                    .then((result) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(result.data);
                    yield promises_1.default.writeFile(`${currentDir}/${z}/${y}/${x}.png`, Buffer.from(result.data));
                    totalCounter++;
                    zoomCounter++;
                }))
                    .catch((err) => {
                    console.log(`Can't download ${URLMAP}${z}/${y}/${x}.png`);
                    console.log(err);
                });
            }
        }
        console.log(`Nombre de fichier pour le zoom ${z}: ${zoomCounter}`);
    }
    console.log(`Nombre de fichier total: ${totalCounter}`);
});
const createFolder = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(currentDir);
    const date = Date.now().toString();
    yield promises_1.default.mkdir(`${currentDir}/MapTiles${date}`);
    currentDir = `${currentDir}/MapTiles${date}`;
});
main();
//# sourceMappingURL=App.js.map