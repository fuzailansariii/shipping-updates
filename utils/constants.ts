export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  image: ["image/jpeg", "image/jpg", "image/png"],
  all: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
} as const;

export const MAX_FILE_SIZE: Record<string, number> = {
  pdf: 30 * 1024 * 1024, // 30MB
  image: 5 * 1024 * 1024, // 5MB
  all: 30 * 1024 * 1024,
  default: 30 * 1024 * 1024, // 30MB
} as const;

export const FILE_UPLOAD_MESSAGE = {
  SIZE_ERROR: "File exceeds maximum size limit",
  SIZE_ERROR_PDF: "PDF file must be less than 30MB",
  SIZE_ERROR_IMAGE: "Image file must be less than 5MB",
  TYPE_ERROR: "Invalid file type",
  TYPE_ERROR_PDF: "Only PDF files are allowed",
  TYPE_ERROR_IMAGE: "Only JPG, PNG images are allowed",
  UPLOAD_ERROR: "Failed to upload file",
  FETCH_ERROR: "Failed to fetch files",
} as const;
