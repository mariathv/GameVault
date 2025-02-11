export const truncateTextChars = (text, maxLength) => {
  if (!text) return;
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};
export const truncateTextWords = (text, maxWords) => {
  if (!text) return;
  const words = text.split(" ");
  if (words.length <= maxWords) {
    return text;
  }
  return words.slice(0, maxWords).join(" ") + "...";
};
