import { validIfArrayOfType, validIfTrue, validIfType } from "./utils";

export interface IBuilderOptionMap {
  [input: string]: (value: string | string[] | boolean, filter: string, json: object | string) =>
    any | undefined;
}

export interface IParamOptionMap {
  input?: string;
  output?: string;
  locations?: string[];
  raw?: boolean;
  color?: boolean;
  slurp?: boolean;
  sort?: boolean;

  [index: string]: any;
}

export const ParamOptionDefaults = {
  input: "file",
  output: "pretty",
  raw: false,
  slurp: false,
  sort: false,
};

export const optionDefaults = ParamOptionDefaults;

export const paramBuildersDefault: IBuilderOptionMap = {
  color: validIfTrue(() => {
    return "--color-output";
  }),
  locations: validIfArrayOfType("string", (values: string[]) => {
    return values.map((value) => `-L ${value}`);
  }),
  output: validIfType("string", (value) => {
    if (["string", "compact"].includes(value)) {
      return "--compact-output";
    }
  }),
  raw: validIfTrue(() => {
    return "-r";
  }),
  slurp: validIfTrue(() => {
    return "--slurp";
  }),
  sort: validIfTrue(() => {
    return "--sort-keys";
  }),
};
