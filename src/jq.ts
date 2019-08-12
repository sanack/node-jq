import childProcess from "child_process";
import path from "path";
import stripFinalNewline from "strip-final-newline";

import { DefaultParamMap, PartialParamMap, validate } from "./options";

export class JQ {
  private jqPath: string;
  private spawnOptions: object | undefined;

  constructor(jqFolderPath?: string, spawnOptions?: childProcess.SpawnOptions) {
    const manualJQPath = jqFolderPath ? path.join(jqFolderPath, "./jq") : jqFolderPath;
    this.jqPath = manualJQPath || process.env.JQ_PATH || path.join(__dirname, "..", "bin", "jq");
    this.spawnOptions = spawnOptions;
  }

  public async run(filter: string | null, json: string | string[], paramOptions: PartialParamMap = {}) {
    const { command, args, stdin } = this.createSpawnParameters(filter, json, paramOptions);
    const stdout = await this.getResult(command, args, stdin);
    if (paramOptions.output === "json") {
      let result;
      try {
        result = JSON.parse(stdout);
      } catch (error) {
        result = stdout;
      }
      return result;
    } else {
      return stdout;
    }
  }

  public validate(filter: string | null, json: string | string[], paramOptions: PartialParamMap) {
    let result: any;

    try {
      result = validate({ filter, json }, paramOptions );
    } catch (e) {
      throw e;
    }

    return result;
  }

  public createSpawnParameters(filter: string | null, json: string | string[], paramOptions: PartialParamMap) {
    const { args, stdin } = this.validate(filter, json, paramOptions);

    return {
      args,
      command: this.jqPath,
      stdin,
    };
  }

  public async getResult(command: string, args: string[], stdin: string) {
    try {
      const result = await this.spawn(command, args, stdin);
      return result;
    } catch (e) {
      throw e;
    }
  }

  public spawn(command: string, args: string[], stdin: string) {
    return new Promise<string>((resolve, reject) => {
      const process = childProcess.spawn(command, args, this.spawnOptions);
      let stdout = "";
      let stderr = "";

      if (stdin) {
        process.stdin.write(stdin);
        process.stdin.end();
      }

      process.stdout.on("data", (data: any) => {
        stdout += data;
      });

      process.stderr.on("data", (data: any) => {
        stderr += data;
      });

      process.on("close", (code: any) => {
        if (code !== 0) {
          reject(Error(stderr));
        } else {
          resolve(stripFinalNewline(stdout));
        }
      });

      process.on("error", (error) => {
        reject(error);
      });
    });
  }
}

export const jq = new JQ();
export const run = (filter: string | null, json: string, paramOptions: PartialParamMap) => {
  return jq.run(filter, json, paramOptions);
};
