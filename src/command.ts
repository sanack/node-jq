import { jq } from "./jq";
import { IParamOptionMap } from "./options";

export function commandFactory(filter: string, json: string, paramOptions: IParamOptionMap) {
    return jq.createSpawnParameters(filter, json, paramOptions);
}
