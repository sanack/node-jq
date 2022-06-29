import path from 'path'
import { isJSONPath, isPathValid } from "./json-path";

const DEFAULT_LOCAL_JQ_PATH = path.join(__dirname, '..', 'bin', 'jq');

const validateJSONPath = (path: string) => isJSONPath(path) && isPathValid(path)

const getFileArray = (path: unknown): string[] => {
  let files: string[] = [];
  if (Array.isArray(path) || (typeof path === 'string')) {
    files = files.concat(path)
  }

  if (files.length === 0 || !files.every(validateJSONPath)) {
    throw new Error('No valid path provided')
  }

  return files;
}

type InputType = "file" | 'json' | 'string';
type OutputType = 'string' | 'compact' | 'pretty' | 'json';

export type Options = {
  color: boolean;
  input: InputType;
  output: OutputType;
  raw: boolean;
  slurp: boolean;
  sort: boolean;
  jqPath: string;
  cwd: string,
};

export type PartialOptions = Partial<Options>;

export const optionDefaults: Options = {
  input: 'file',
  output: 'pretty',
  slurp: false,
  sort: false,
  raw: false,
  color: true,
  jqPath: process.env.JQ_PATH || DEFAULT_LOCAL_JQ_PATH,
  cwd: __dirname,
}

type CLIFlags = Omit<Omit<Options, 'cwd'>, 'jqPath'>;
type Flags = keyof CLIFlags;
type ValueOf<T> = T[keyof T];
type Values = ValueOf<Options>;

const optionMap: Map<Flags, string> = new Map([
  ["slurp", '--slurp' ],
  ["sort", '--sort-keys' ],
  ["color", '--color-output' ],
  ["raw", '-r' ],
]);

const outputMap: Map<OutputType, string> = new Map([
  ["pretty", ''],
  ["string", '--raw-output'],
  ["compact", '--compact-output'],
  ["json", ''],
]);

type Input = unknown | string | string[];

const parseOptions = (filter: string, input: Input, options: Options) => {
  const flags = Object.entries(options).map(([key, value]: [string, Values]) => {
    const flag: string | undefined = optionMap.get(key as Flags);
    return value && flag ? flag : ""
  }).filter(str => str !== "");

  const outputFlag = outputMap.get(options.output) || "";
  const inputFlag = options.input === 'file' ? getFileArray(input) : [input] as string[];
  const stdin = options.output === 'json' ? JSON.stringify(input) : input as string;
  const args: string[] = [filter, ...inputFlag, outputFlag, ...flags];

  return { args, stdin }
}

export const commandFactory = (filter: string, input: Input, userOptions: PartialOptions = {}) => {
  const options: Options = {
    ...optionDefaults,
    ...userOptions
  };

  const {args, stdin} = parseOptions(filter, input, options);

  return {
    command: options.jqPath,
    args,
    stdin,
    cwd: options.cwd
  }
}
