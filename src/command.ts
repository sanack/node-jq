import { jq } from "./jq";
import { IParamMap } from "./options";

export const FILTER_UNDEFINED_ERROR =
    'node-jq: invalid filter argument supplied: "undefined"';
export const INPUT_JSON_UNDEFINED_ERROR =
    "node-jq: invalid json object argument supplied: \"undefined\"";
export const INPUT_STRING_ERROR =
    "node-jq: invalid json string argument supplied";

export function commandFactory(filter: string, json: string, paramOptions: IParamMap) {
    return jq.createSpawnParameters(filter, json, paramOptions);
}
