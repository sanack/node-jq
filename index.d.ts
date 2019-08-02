import { SpawnOptions, spawn } from "child_process"

export interface ParamOptionMap {
    input?: string
    output?: string
    locations?: string
    raw?: boolean
    color?: boolean
    slurp?: boolean
    sort?: boolean

    [index: string]: any
}

export interface BuilderOptionMap {
    [input: string]: { buildParams: (params: string[], value: any) => void }
}

interface SpawnParameters {
    command: string,
    args?: string[],
    options?: SpawnOptions
}

export class JQ {
    private jqPath: string
    private spawnOptions: object | undefined
    private paramOptionDefaults: ParamOptionMap
    private paramBuilders: ParamOptionMap

    constructor(jqPath?: string, spawnOptions?: SpawnOptions,
        _paramOptionDefaults?: ParamOptionMap, paramBuilders?: BuilderOptionMap)
    run(filter: string, json: string, paramOptions: ParamOptionMap): Promise<object | string>
    createSpawnParameters(filter: string, json: string, paramOptions: ParamOptionMap): SpawnParameters
    parseParamOptions(options: ParamOptionMap): string[]
    getResult(command: string, args: string[], stdin: string): Promise<string>
}

export function run(filter: string, json: string[] | string, options: ParamOptionMap): Promise<object | string>