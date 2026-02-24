// Format bytes to human-readable file size
export const formatFileSize = (bytes: number): string => {
  if (!bytes) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Parse comma-separated topics string into array
export const parseTopics = (topicString: string): string[] => {
  return topicString
    .split(",")
    .map((topic) => topic.trim())
    .filter((topic) => topic.length > 0);
};
