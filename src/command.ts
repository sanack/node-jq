import { jq } from "./jq";
import { ParamOptionMap } from "./options";

export function commandFactory(filter: string, json: string, paramOptions: ParamOptionMap) {
    return jq.createSpawnParameters(filter, json, paramOptions);
}