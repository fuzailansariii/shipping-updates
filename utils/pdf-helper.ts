// Format bytes to human-readable file size
export const formatFileSize = (size: number): string => {
  if (size >= 1024) {
    return `${(size / 1024).toFixed(2)} MB`;
  }
  return `${size.toFixed(2)} KB`;
};

// Parse comma-separated topics string into array
export const parseTopics = (topicString: string): string[] => {
  return topicString
    .split(",")
    .map((topic) => topic.trim())
    .filter((topic) => topic.length > 0);
};
