import * as Joi from "joi";
import { isJSONPath, isPathValid } from "./json-path";

type Options = {
  color: boolean;
  input: string;
  locations: string[];
  output: string;
  raw: boolean;
  slurp: boolean;
  sort: boolean;
};

export type PartialOptions = Partial<Options>;

function createBooleanSchema(name: string, value: string) {
  return Joi.string().when(`${name}`, {
    is: Joi.boolean().required().valid(true),
    then: Joi.string().default(value),
  });
}

const strictBoolean = Joi.boolean().default(false).strict();
const path = Joi.any()
  .custom((value, helpers) => {
    if (isJSONPath(value) && isPathValid(value)) return value;
    else if (!isJSONPath(value))
      return helpers.error("any.invalid", { type: "json" });
    else if (!isPathValid(value))
      return helpers.error("any.invalid", { type: "path" });
  }, "path validation")
  .required();

export const optionsSchema = Joi.object({
  color: strictBoolean,
  input: Joi.string().default("file").valid("file", "json", "string"),
  locations: Joi.array().items(Joi.string()).default([]),
  output: Joi.string()
    .default("pretty")
    .valid("string", "compact", "pretty", "json"),
  raw: strictBoolean,
  slurp: strictBoolean,
  sort: strictBoolean,
});

export const preSpawnSchema = Joi.object({
  filter: Joi.string().allow("", null).required(),
  json: Joi.any().alter({
    file: (schema) => {
      return schema
        .when("/json", {
          is: Joi.array().required(),
          then: Joi.array().items(path),
          otherwise: path,
        })
        .label("path");
    },
    json: (schema) =>
      Joi.alternatives()
        .try(
          Joi.array(),
          Joi.object().allow("", null).required().label("json object")
        )
        .required(),
    string: (schema) => Joi.string().required().label("json string"),
  }),
});

export const spawnSchema = Joi.object({
  args: Joi.object({
    color: createBooleanSchema("$options.color", "--color-output"),
    input: Joi.any().alter({
      file: (schema) =>
        schema.when("$json", {
          is: [Joi.array().items(Joi.string()), Joi.string()],
          then: Joi.array().default(
            Joi.ref("$json", {
              adjust: (value) => {
                return [].concat(value);
              },
            })
          ),
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
  stdin: Joi.string()
    .default("")
    .alter({
      json: (schema) =>
        schema.default(
          Joi.ref("$json", {
            adjust: (value) => JSON.stringify(value),
          })
        ),
      string: (schema) => schema.default(Joi.ref("$json")),
    }),
});

export const parseOptions = (
  options: PartialOptions,
  filter: string,
  json: any
): string[] => {
  const { args }: { args: Record<string, string> } = Joi.attempt(
    {},
    spawnSchema.tailor(options.input || []),
    { context: { filter, json, options } }
  );

  if (options.input === "file") {
    return Object.keys(args)
      .filter((key: string) => key !== "input")
      .reduce((list: string[], key: string) => list.concat(args[key]), [])
      .concat(filter, json);
  }

  return Object.values(args).concat(filter);
};

export const optionDefaults = Joi.attempt({}, optionsSchema);
