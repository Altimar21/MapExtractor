import fs from "fs/promises";
import { getDateString, getTimeString } from "./timeUtil";

// Log file for current exec
let logFile: string;
let currentDir = `${__dirname}/..`;

export const createLogFolder = async (): Promise<void> => {
  try {
    await fs.mkdir(`${currentDir}/Logs/`);
    log(`Log folder created.`);
  } catch (err) {
    log(`Log folder already exist.`);
  }
};

export const log = async (str: string, withConsole: boolean = false) => {
  if (withConsole) console.log(str);
  await fs.appendFile(
    `${currentDir}/Logs/${getDateString()}.log`,
    `${getTimeString()} -- ${str}`
  );
};
