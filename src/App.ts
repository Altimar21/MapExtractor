import axios from "axios";
import fs from "fs/promises";
const MAXZOOM = 2;
const MINZOOM = 0;
const ZOOMWARN = 13;
const URLMAP = ``;
const delayMs = 1000;
let totalCounter = 0;
let zoomCounter = 0;
let currentDir = `${__dirname}/..`;

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const main = async () => {
  console.log(`MapExtractor starting ...`);
  console.log(`MapExtractor MINZOOM = ${MINZOOM}`);
  console.log(`MapExtractor MAXZOOM = ${MAXZOOM}`);
  console.log(`MapExtractor ZOOMWARN = ${ZOOMWARN}`);
  console.log(`MapExtractor URLMAP = ${URLMAP}`);
  await createFolder();
  for (let z = MINZOOM; z <= MAXZOOM; z++) {
    await fs.mkdir(`${currentDir}/${z}`);
    console.log(`Starting zoom ${z}.`);
    zoomCounter = 0;
    for (let y = 0; y < Math.pow(2, z); y++) {
      await fs.mkdir(`${currentDir}/${z}/${y}`);
      for (let x = 0; x < Math.pow(2, z); x++) {
        console.log(`Searching ${URLMAP}${z}/${y}/${x}`);
        await delay(delayMs);
        axios
          .get(`${URLMAP}${z}/${y}/${x}.png`, { responseType: "arraybuffer" })
          .then(async (result) => {
            console.log(result.data);
            await fs.writeFile(
              `${currentDir}/${z}/${y}/${x}.png`,
              Buffer.from(result.data)
            );
            totalCounter++;
            zoomCounter++;
          })
          .catch((err) => {
            console.log(`Can't download ${URLMAP}${z}/${y}/${x}.png`);
            console.log(err);
          });
      }
    }
    console.log(`Nombre de fichier pour le zoom ${z}: ${zoomCounter}`);
  }

  console.log(`Nombre de fichier total: ${totalCounter}`);
};

const createFolder = async () => {
  console.log(currentDir);
  const date = Date.now().toString();
  await fs.mkdir(`${currentDir}/MapTiles${date}`);
  currentDir = `${currentDir}/MapTiles${date}`;
};

main();
