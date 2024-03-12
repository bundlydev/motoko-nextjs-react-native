import path from "path";
import { promises as fs } from "fs";
import fsExtra from "fs-extra";

/**
 * Sets variables needed to interact with canisters
 *
 * @param {String[]} canisterNames
 * @param {String} relativeRootPath
 */
async function setCanisterVariables(canisterNames, relativeRootPath, prefix) {
  try {
    const network = process.env.DFX_NETWORK || "local";
    const canisterIdsPath = path.resolve(relativeRootPath, ".dfx", network, "canister_ids.json");

    const canistersJson = await fs.readFile(canisterIdsPath, "utf8");
    const canisters = JSON.parse(canistersJson);

    const variables = [];

    for (const name of canisterNames) {
      const variableName = `${prefix}_${name.toUpperCase()}_CANISTER_ID`;

      process.env[variableName] = canisters[name][network];

      variables.push(variableName);
    }

    console.log("Variables set:", variables);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Copies declarations from root project
 *
 * @param {String[]} canisterNames
 * @param {String} relativeRootPath
 */
async function copyDeclarations(canisterNames, relativeRootPath) {
  const DIRECTORY_PATH = path.resolve(relativeRootPath, "src/declarations");

  try {
    const dirents = await fs.readdir(DIRECTORY_PATH, { withFileTypes: true });

    for (const name of canisterNames) {
      const source = path.resolve(DIRECTORY_PATH, name);
      const dest = path.resolve("./src/declarations", name);
      await fsExtra.copy(source, dest);
    }

    console.log("Declarations copied", canisterNames);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Bootstraps the project
 *
 * @param {String} relativeRootPath Relative path to root project
 * @param {String} envPrefix Prefix for environment variables
 */
export async function bootstrap(relativeRootPath, envPrefix) {
  const dfxJsonPath = path.resolve(relativeRootPath, "dfx.json");

  const dfxJson = await fs.readFile(dfxJsonPath, "utf8");
  const dfx = JSON.parse(dfxJson);

  const canisterNames = Object.keys(dfx.canisters)
    .filter((key) => key !== "internet-identity")
    .filter((key) => dfx.canisters[key].type !== "assets");

  await setCanisterVariables(canisterNames, relativeRootPath, envPrefix);
  await copyDeclarations(canisterNames, relativeRootPath);
}
