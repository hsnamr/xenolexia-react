/**
 * Web mock for react-native-fs
 * Uses browser APIs where possible
 */

export const DocumentDirectoryPath = '/documents';
export const CachesDirectoryPath = '/caches';
export const ExternalDirectoryPath = '/external';
export const TemporaryDirectoryPath = '/temp';

// In-memory storage for web
const fileStorage = new Map<string, string>();

export const readFile = async (
  filepath: string,
  _encoding?: string,
): Promise<string> => {
  const content = fileStorage.get(filepath);
  if (content === undefined) {
    throw new Error(`File not found: ${filepath}`);
  }
  return content;
};

export const writeFile = async (
  filepath: string,
  contents: string,
  _encoding?: string,
): Promise<void> => {
  fileStorage.set(filepath, contents);
};

export const exists = async (filepath: string): Promise<boolean> => {
  return fileStorage.has(filepath);
};

export const unlink = async (filepath: string): Promise<void> => {
  fileStorage.delete(filepath);
};

export const mkdir = async (_filepath: string): Promise<void> => {
  // No-op for web
};

export const readDir = async (
  _dirpath: string,
): Promise<Array<{name: string; path: string; isFile: () => boolean}>> => {
  return [];
};

export const copyFile = async (
  filepath: string,
  destPath: string,
): Promise<void> => {
  const content = fileStorage.get(filepath);
  if (content) {
    fileStorage.set(destPath, content);
  }
};

export const moveFile = async (
  filepath: string,
  destPath: string,
): Promise<void> => {
  const content = fileStorage.get(filepath);
  if (content) {
    fileStorage.set(destPath, content);
    fileStorage.delete(filepath);
  }
};

export const stat = async (
  filepath: string,
): Promise<{size: number; isFile: () => boolean; isDirectory: () => boolean}> => {
  const content = fileStorage.get(filepath);
  return {
    size: content?.length || 0,
    isFile: () => true,
    isDirectory: () => false,
  };
};

export default {
  DocumentDirectoryPath,
  CachesDirectoryPath,
  ExternalDirectoryPath,
  TemporaryDirectoryPath,
  readFile,
  writeFile,
  exists,
  unlink,
  mkdir,
  readDir,
  copyFile,
  moveFile,
  stat,
};
