import { SpawnOptions, spawn } from "child_process"

export interface IParamOptionMap {
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
    [input: string]: { buildParams: (params: string[], value: any) => any }
}

interface SpawnParameters {
    command: string,
    args?: string[],
    options?: SpawnOptions
}

export class JQ {
    private jqPath: string
    private spawnOptions: object | undefined
    private paramOptionDefaults: IParamOptionMap
    private paramBuilders: IParamOptionMap

    constructor(jqPath?: string, spawnOptions?: SpawnOptions,
        paramOptionDefaults?: IParamOptionMap, paramBuilders?: BuilderOptionMap)
    run(filter: string, json: string, paramOptions: IParamOptionMap): Promise<object | string>
    createSpawnParameters(filter: string, json: string, paramOptions: IParamOptionMap): SpawnParameters
    parseParamOptions(options: IParamOptionMap): string[]
    getResult(command: string, args: string[], stdin: string): Promise<string>
}

export function run(filter: string, json: string[] | string, options: IParamOptionMap): Promise<object | string>