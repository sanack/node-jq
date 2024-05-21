import { PartialOptions } from "./options"

export function run(filter: string, json: any, options?: PartialOptions, jqPath?: string, cwd?: string, detached?: boolean): Promise<object | string | undefined>
