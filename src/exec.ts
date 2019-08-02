import { jq } from "./jq";

export function exec(command: string, args: string[], stdin: string) {
    return jq.getResult(command, args, stdin);
}