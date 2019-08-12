import * as childProcess from "child_process";
import { PartialOptions } from "./options"

interface run {
    (filter: string, json: any, options?: PartialOptions, jqPath?: string, spawnOptions?: childProcess.SpawnOptions): Promise<object | string>
}
export class JQ {
    constructor(jqPath?: string, spawnOptions?: childProcess.SpawnOptions);
    run: run;
}
export const run: run;