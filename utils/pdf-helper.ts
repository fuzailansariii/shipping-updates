// Format bytes to human-readable file size
export const formatFileSize = (bytes: number): string => {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

// Parse comma-separated topics string into array
export const parseTopics = (topicString: string): string[] => {
  return topicString
    .split(",")
    .map((topic) => topic.trim())
    .filter((topic) => topic.length > 0);
};
