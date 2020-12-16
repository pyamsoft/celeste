function createSentenceCaser() {
  const sentenceCaseStrings = {};
  return function sentenceCase(string) {
    if (!sentenceCaseStrings[string]) {
      sentenceCaseStrings[string] = string
        .split(/\s+/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }

    return sentenceCaseStrings[string];
  };
}

export const sentenceCase = createSentenceCaser();
