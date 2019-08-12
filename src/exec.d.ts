import * as childProcess from "child_process";

export default function(command: string, args: string[], stdin: string, spawnOptions?: childProcess.SpawnOptions): Promise<string>