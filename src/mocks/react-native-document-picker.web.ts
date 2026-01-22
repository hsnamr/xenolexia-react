/**
 * Web mock for react-native-document-picker
 * Uses the File System Access API where available, falls back to input element
 */

export interface DocumentPickerResponse {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export const types = {
  allFiles: '*/*',
  images: 'image/*',
  plainText: 'text/plain',
  audio: 'audio/*',
  video: 'video/*',
  pdf: 'application/pdf',
};

export const pick = async (options?: {
  type?: string | string[];
  allowMultiSelection?: boolean;
}): Promise<DocumentPickerResponse[]> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = options?.allowMultiSelection ?? false;

    if (options?.type) {
      const types = Array.isArray(options.type) ? options.type : [options.type];
      input.accept = types.join(',');
    }

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) {
        reject(new Error('User cancelled document picker'));
        return;
      }

      const results: DocumentPickerResponse[] = Array.from(files).map((file) => ({
        uri: URL.createObjectURL(file),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
      }));

      resolve(results);
    };

    input.oncancel = () => {
      reject(new Error('User cancelled document picker'));
    };

    input.click();
  });
};

export const pickSingle = async (options?: {
  type?: string | string[];
}): Promise<DocumentPickerResponse> => {
  const results = await pick({...options, allowMultiSelection: false});
  return results[0];
};

export const isCancel = (err: unknown): boolean => {
  return (
    err instanceof Error && err.message.includes('User cancelled document picker')
  );
};

export default {
  types,
  pick,
  pickSingle,
  isCancel,
};
