
// tslint:disable-next-line: no-var-requires
const Joi = require("@hapi/joi");
import isPathValid from "is-valid-path";

export interface IParamMap {
  input: string;
  output: string;
  locations: string[];
  raw: boolean;
  color: boolean;
  slurp: boolean;
  sort: boolean;

  [input: string]: string | string[] | boolean;
}

export type PartialParamMap = Partial<IParamMap>;
export type DefaultParamMap = PartialParamMap & { input: string, output: string };

function createBooleanSchema(name: string, value: string) {
  return Joi.string().when(`${name}`, {
    is: Joi.boolean().required().valid(true),
    then: Joi.string().default(value),
  });
}

const NODE_JQ_ERROR_TEMPLATE = `node-jq: invalid {#label} `
  + `argument supplied{if(#label == "path" && #value == "", " (not a .json file)", "")}`
  + `{if(#label == "path" && #value != "", " (not a valid path)", "")}: `
  + `"{if(#value != undefined, #value, "undefined")}"`;

const messages = {
  "any.invalid": NODE_JQ_ERROR_TEMPLATE,
  "any.required": NODE_JQ_ERROR_TEMPLATE,
  "string.base": NODE_JQ_ERROR_TEMPLATE,
  "string.empty": NODE_JQ_ERROR_TEMPLATE,
};

export function validate(context: any, options: any): any {
  const validatedOptions = Joi.attempt(options, optionsSchema);
  const validatedPreSpawn = Joi.attempt(context, preSpawnSchema.tailor(validatedOptions.input), { messages });
  const validatedSpawn = Joi.attempt({}, spawnSchema.tailor(validatedOptions.input),
    { context: { ...validatedPreSpawn, options: validatedOptions } });

  if (validatedOptions.input === "file") {
    return {
      args: Object.keys(validatedSpawn.args || {}).filter((key) => key !== "input")
        .reduce((list, key) => list.concat(validatedSpawn.args[key]), [])
        .concat(validatedPreSpawn.filter, validatedPreSpawn.json),
      stdin: validatedSpawn.stdin,
    };
  }
  return {
    args: Object.values(validatedSpawn.args || {}).concat(validatedPreSpawn.filter),
    stdin: validatedSpawn.stdin,
  };
}

const strictBoolean = Joi.boolean().default(false).strict();
const path = Joi.string().required()
  .custom((value: any, helpers: any) => {
    return isPathValid(value) ? value : helpers.error("any.invalid");
  }, "path validation")
  .pattern(/.json$/).message(`node-jq: invalid {#label} `
    + `argument supplied (not a .json file): "{if(#value != undefined, #value, "undefined")}"`);

const optionsSchema = Joi.object({
  color: strictBoolean,
  input: Joi.string().default("file").valid("file", "json", "string"),
  locations: Joi.array().items(Joi.string()).default([]),
  output: Joi.string().default("pretty").valid("string", "compact", "pretty", "json"),
  raw: strictBoolean,
  slurp: strictBoolean,
  sort: strictBoolean,
});

const preSpawnSchema = Joi.object({
  filter: Joi.string().allow("", null).required(),
  json: Joi.any().alter({
    file: (schema: any) => schema.when("/json",
      {
        is: Joi.string().allow(null, ""),
        otherwise: Joi.array().items(path).required(),
        then: path,
      }).label("path"),
    json: (schema: any) => Joi.object().allow("", null).required().label("json object"),
    string: (schema: any) => Joi.string().required().label("json string"),
  }),
});

const spawnSchema = Joi.object({
  args: Joi.object({
    color: createBooleanSchema("$options.color", "--color-output"),
    input: Joi.any().alter({
      file: (schema: any) => schema.when("$json", {
        is: [Joi.array().items(Joi.string()), Joi.string()],
        then: Joi.array().default(Joi.ref("$json", {
          adjust: (value: any) => {
            return [].concat(value);
          },
        })),
      }),
    }),
    locations: Joi.ref("$options.locations"),
    output: Joi.string().when("$options.output", {
      is: Joi.string().required().valid("string", "compact"),
      then: Joi.string().default("--compact-output"),
    }),
    raw: createBooleanSchema("$options.raw", "-r"),
    slurp: createBooleanSchema("$options.slurp", "--slurp"),
    sort: createBooleanSchema("$options.sort", "--sort-keys"),
  }).default(),
  stdin: Joi.string().default("").alter({
    json: (schema: any) => schema.default(Joi.ref("$json", {
      adjust: (value: any) => JSON.stringify(value),
    })),
    string: (schema: any) => schema.default(Joi.ref("$json")),
  }),
});

export const parseOptions = (paramOptions = {} as PartialParamMap) => {
  const validatedOptions = Joi.attempt(paramOptions, optionsSchema);
  const validatedSpawn = Joi.attempt({}, spawnSchema.tailor(validatedOptions.input));

  return validatedSpawn.args;
};

export const optionDefaults = Joi.attempt({}, optionsSchema);
