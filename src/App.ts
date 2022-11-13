import axios from "axios";
import fs from "fs/promises";
import { createLogFolder, log } from "./utils/logUtil";
import { delay, getDateString } from "./utils/timeUtil";
import config from "../config.json";

let tileTotalCounter = 0;
let totalCounter = 0;
let totalCounterError = 0;
let zoomCounter = 0;
let currentDir = `${__dirname}/../..`;
let consecutiveError = 0;

const init = async () => {
  await createLogFolder();
  log(`MapExtractor starting ...`, true);
  log(`MapExtractor MINZOOM = ${config.minZoom}`, config.verbose);
  log(`MapExtractor MAXZOOM = ${config.maxZoom}`, config.verbose);
  if (config.zoomWarn)
    log(`MapExtractor ZOOMWARN = ${config.zoomWarn}`, config.verbose);
  log(`MapExtractor URLMAP = ${config.url}`, config.verbose);
  await createFolder();
  log(
    `${config.maxZoom - config.minZoom + 1} zoom to extract.`,
    config.verbose
  );
  for (let z = config.minZoom; z <= config.maxZoom; z++) {
    tileTotalCounter += Math.pow(2, z) * Math.pow(2, z);
  }
  log(`${tileTotalCounter} tiles to extract.`, config.verbose);
  let numberDay = (tileTotalCounter * config.delayMs) / 1000 / 60 / 60 / 24;
  log(`${numberDay} day for extract all.`, true);
};

const main = async () => {
  await init();

  for (let z = config.minZoom; z <= config.maxZoom; z++) {
    await fs.mkdir(`${currentDir}/${z}`);
    log(`Starting zoom ${z}.`, config.verbose);
    zoomCounter = 0;
    for (let y = 0; y < Math.pow(2, z); y++) {
      await fs.mkdir(`${currentDir}/${z}/${y}`);
      for (let x = 0; x < Math.pow(2, z); x++) {
        if (consecutiveError > config.consecutiveErrorToStop) {
          log(`${consecutiveError} consecutive errors. Stopping ...`, true);
          return;
        }
        log(`Searching ${config.url}${z}/${y}/${x}`, config.verbose);
        await delay(config.delayMs);
        // axios
        //   .get(`${config.url}${z}/${y}/${x}.png`, {
        //     responseType: "arraybuffer",
        //   })
        //   .then(async (result) => {
        //     await fs.writeFile(
        //       `${currentDir}/${z}/${y}/${x}.png`,
        //       Buffer.from(result.data)
        //     );
        //     totalCounter++;
        //     zoomCounter++;
        //     consecutiveError = 0;
        //   })
        //   .catch((err) => {
        //     consecutiveError++;
        //     totalCounterError++;
        //     log(
        //       `Can't download ${config.url}${z}/${y}/${x}.png`,
        //       config.verbose
        //     );
        //     log(err);
        //   });
      }
    }
    log(`Total file for zoom ${z}: ${zoomCounter}`, config.verbose);
  }
  log(`Total file with success: ${totalCounter}`, true);
  log(`Total file with error: ${totalCounter}`, true);
};

const createFolder = async () => {
  const date = getDateString();
  try {
    await fs.mkdir(`${currentDir}/MapTiles${date}`);
    log(`MapTiles folder created.`);
  } catch (err) {
    await fs.rm(`${currentDir}/MapTiles${date}/`, { recursive: true });
    await fs.mkdir(`${currentDir}/MapTiles${date}`);
    log(`MapTiles folder already exist.`);
  }
  currentDir = `${currentDir}/MapTiles${date}`;
};

main();
