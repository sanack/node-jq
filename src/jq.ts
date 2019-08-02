import path from 'path';
import childProcess from "child_process";
import stripFinalNewline from 'strip-final-newline';

import { paramOptionDefaults, paramBuildersDefault, ParamOptionMap } from "./options";
import { getFileArray, validateFilterAndInput } from "./utils";

export class JQ {
  private jqPath: string
  private spawnOptions: object | undefined
  private paramOptionDefaults: ParamOptionMap
  private paramBuilders: ParamOptionMap

  constructor(jqPath?: string, spawnOptions?: childProcess.SpawnOptions,
    _paramOptionDefaults = paramOptionDefaults, paramBuilders = paramBuildersDefault) {
    this.jqPath = jqPath || process.env.JQ_PATH || path.join(__dirname, '..', 'bin', 'jq');
    this.spawnOptions = spawnOptions;
    this.paramOptionDefaults = _paramOptionDefaults;
    this.paramBuilders = paramBuilders;
  }

  async run(filter: string, json: string, paramOptions: ParamOptionMap = {}) {
    const { command, args, stdin } = this.createSpawnParameters(filter, json, paramOptions);
    const stdout = await this.getResult(command, args, stdin);
    if (paramOptions.output === 'json') {
      let result;
      try {
        result = JSON.parse(stdout)
      } catch (error) {
        result = stdout
      }
      return result
    } else {
      return stdout
    }
  }

  createSpawnParameters(filter: string, json: string, paramOptions: ParamOptionMap) {
    const mergedOptions: ParamOptionMap = {
      ...this.paramOptionDefaults,
      ...paramOptions
    }


    validateFilterAndInput(filter, json, mergedOptions.input);
    let args = [filter, ...this.parseParamOptions(mergedOptions, filter, json)];
    let stdin = '';

    if (mergedOptions.input === 'file') {
      args = [...args, ...getFileArray(json)];
    } else {
      if (mergedOptions.input === 'json') {
        stdin = JSON.stringify(json);
      } else {
        stdin = json;
      }
    }

    return {
      command: this.jqPath,
      args,
      stdin
    }
  }

  parseParamOptions(options: ParamOptionMap = {}, filter: string, json: object|string) {
    return Object.keys(options).reduce((params, key) => {
      const builder = this.paramBuilders[key];
      const value = options[key];

      if (builder === undefined) return params;

      const newParams = builder(value, filter, json);

      if (newParams) {
        if (Array.isArray(newParams)) params.unshift(...newParams);
        else params.unshift(newParams);
      }

      return params;
    }, <string[]>[]);
  }

  async getResult(command: string, args: string[], stdin: string) {
    const stdout = new Promise<string>((resolve, reject) => {
      const process = childProcess.spawn(command, args, this.spawnOptions);
      var stdout = '';
      var stderr = '';

      if (stdin) {
        process.stdin.write(stdin)
        process.stdin.end()
      }

      process.stdout.on('data', (data: any) => {
        stdout += data
      })

      process.stderr.on('data', (data: any) => {
        stderr += data
      })

      process.on('close', (code: any) => {
        if (code !== 0) {
          reject(Error(stderr));
        } else {
          resolve(stripFinalNewline(stdout));
        }
      });

      process.on('error', error => {
        reject(error);
      })
    });

    try {
      return await stdout;
    } catch(e) {
      throw e;
    }
  }
}

export const jq = new JQ();
export const run = function (filter: string, json: string, paramOptions: ParamOptionMap = {}) {
  return jq.run(filter, json, paramOptions);
}