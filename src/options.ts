import { validIfTrue, validIfType, validIfArrayOfType } from "./utils";

export interface BuilderOptionMap {
  [input: string]: (value: string | string[] | boolean, filter: string, json: object|string) => string[]
}

export interface ParamOptionMap {
  input?: string
  output?: string
  locations?: string[]
  raw?: boolean
  color?: boolean
  slurp?: boolean
  sort?: boolean

  [index: string]: any
}

export const paramOptionDefaults = {
  input: 'file',
  output: 'pretty',
  slurp: false,
  sort: false,
  raw: false
}

export const optionDefaults = paramOptionDefaults;

export const paramBuildersDefault: BuilderOptionMap = {
  output: validIfType("string", function (value: string) {
    if (["string", "compact"].includes(value)) return '--compact-output';
  }),
  slurp: validIfTrue(function() {
    return '--slurp';
  }),
  sort: validIfTrue(function() {
    return '--sort-keys';
  }),
  color: validIfTrue(function() {
    return '--color-output';
  }),
  raw: validIfTrue(function() {
    return '-r';
  }),
  locations: validIfArrayOfType("string", function (values: string[]) {
    return values.map(value=>`-L ${value}`);
  })
}