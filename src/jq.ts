import childProcess from "child_process";
import path from "path";
import stripFinalNewline from "strip-final-newline";

import { IParamOptionMap, paramBuildersDefault, ParamOptionDefaults } from "./options";
import { getFileArray, validateFilterAndInput } from "./utils";

export class JQ {
  private jqPath: string;
  private spawnOptions: object | undefined;
  private paramOptionDefaults: IParamOptionMap;
  private paramBuilders: IParamOptionMap;

  constructor(jqPath?: string, spawnOptions?: childProcess.SpawnOptions,
              paramOptionDefaults = ParamOptionDefaults, paramBuilders = paramBuildersDefault) {
    this.jqPath = jqPath || process.env.JQ_PATH || path.join(__dirname, "..", "bin", "jq");
    this.spawnOptions = spawnOptions;
    this.paramOptionDefaults = paramOptionDefaults;
    this.paramBuilders = paramBuilders;
  }

  public async run(filter: string, json: string, paramOptions: IParamOptionMap = {}) {
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

  public createSpawnParameters(filter: string, json: string, paramOptions: IParamOptionMap) {
    const mergedOptions: IParamOptionMap = {
      ...this.paramOptionDefaults,
      ...paramOptions,
    };

    validateFilterAndInput(filter, json, mergedOptions.input);
    let args = [filter, ...this.parseParamOptions(mergedOptions, filter, json)];
    let stdin = "";

    if (mergedOptions.input === "file") {
      args = [...args, ...getFileArray(json)];
    } else {
      if (mergedOptions.input === "json") {
        stdin = JSON.stringify(json);
      } else {
        stdin = json;
      }
    }

    return {
      args,
      command: this.jqPath,
      stdin,
    };
  }

  public parseParamOptions(options: IParamOptionMap = {}, filter: string, json: object|string) {
    return Object.keys(options).reduce((params, key) => {
      const builder = this.paramBuilders[key];
      const value = options[key];

      if (builder === undefined) {
        return params;
      }

      const newParams = builder(value, filter, json);

      if (newParams) {
        if (Array.isArray(newParams)) {
          params.unshift(...newParams);
        } else {
         params.unshift(newParams);
        }
      }

      return params;
    }, [] as string[]);
  }

  public async getResult(command: string, args: string[], stdin: string) {
    const result = this.spawn(command, args, stdin);

    try {
      return await result;
    } catch (e) {
      throw e;
    }
  }

  private spawn(command: string, args: string[], stdin: string) {
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
export const run = (filter: string, json: string, paramOptions: IParamOptionMap = {}) => {
  return jq.run(filter, json, paramOptions);
};
