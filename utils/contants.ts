export const allowedFileType = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const maxSize = 10 * 1024 * 1024;

export const FILE_UPLOAD_MESSAGE = {
  SIZE_ERROR: "File should be less than 10MB",
  TYPE_ERROR: "Only PDF, JPG, and PNG files are allowed",
  UPLOAD_ERROR: "Failed to upload file",
  FETCH_ERROR: "Failed to fetch files",
};
