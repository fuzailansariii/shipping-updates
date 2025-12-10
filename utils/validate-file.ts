import {
  ALLOWED_FILE_TYPES,
  FILE_UPLOAD_MESSAGE,
  MAX_FILE_SIZE,
} from "./constants";

export type UploadKind = "pdf" | "image" | "all";

export interface ValidateResult {
  isValid: boolean;
  error: string | null;
}

export interface ValidationOptions {
  kind: UploadKind;
  maxSize?: number;
  allowedTypes?: string[];
}

export const validateFile = (
  file: File,
  options: ValidationOptions
): ValidateResult => {
  const {
    kind,
    maxSize: customMaxSize,
    allowedTypes: customAllowedTypes,
  } = options;

  const allowedTypes: string[] =
    customAllowedTypes || ALLOWED_FILE_TYPES[kind] || [];
  const maxSize = customMaxSize || MAX_FILE_SIZE[kind] || MAX_FILE_SIZE.default;

  if (!allowedTypes.includes(file.type)) {
    let errorMessage: string = FILE_UPLOAD_MESSAGE.TYPE_ERROR;
    if (kind === "pdf") {
      errorMessage = FILE_UPLOAD_MESSAGE.TYPE_ERROR_PDF;
    } else if (kind === "image") {
      errorMessage = FILE_UPLOAD_MESSAGE.TYPE_ERROR_IMAGE;
    }

    return { isValid: false, error: errorMessage };
  }

  if (file.size > maxSize) {
    let errorMessage: string = FILE_UPLOAD_MESSAGE.SIZE_ERROR;

    if (kind === "pdf") {
      errorMessage = FILE_UPLOAD_MESSAGE.SIZE_ERROR_PDF;
    } else if (kind === "image") {
      errorMessage = FILE_UPLOAD_MESSAGE.SIZE_ERROR_IMAGE;
    }

    return { isValid: false, error: errorMessage };
  }

  return { isValid: true, error: null };
};

export const validateFileSimple = (
  file: File,
  kind: UploadKind
): string | null => {
  const result = validateFile(file, { kind });
  return result.error;
};

export const validateMultipleFiles = (
  files: File[],
  options: ValidationOptions
): ValidateResult[] => {
  return files.map((file) => validateFile(file, options));
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

export const isPDFFile = (file: File): boolean => {
  return file.type === "application/pdf";
};
