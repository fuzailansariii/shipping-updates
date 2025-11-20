import { allowedFileType, FILE_UPLOAD_MESSAGE, maxSize } from "./contants";

export const validateFile = (file: File): string | null => {
  if (file.size > maxSize) {
    return FILE_UPLOAD_MESSAGE.SIZE_ERROR;
  }

  if (!allowedFileType.includes(file.type)) {
    return FILE_UPLOAD_MESSAGE.TYPE_ERROR;
  }
  return null;
};
