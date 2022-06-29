import path from 'path';

const isInvalidPath = (fp: string) => {
  if (fp === '' || typeof fp !== 'string') return true;

  // https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx#maxpath
  const MAX_PATH = 260;
  if (typeof fp !== 'string' || fp.length > (MAX_PATH - 12)) {
    return true;
  }

  const rootPath = path.parse(fp).root;
  if (rootPath) fp = fp.slice(rootPath.length);

  return /[<>:"|?*]/.test(fp);
};

export const isPathValid = (path: string) => !isInvalidPath(path)

export const isJSONPath = (path: string) => {
  return /\.json$/.test(path)
}
