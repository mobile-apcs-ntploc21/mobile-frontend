export const frequencyMatch = (text: string, query: string) => {
  const countCharacters = (str: string) => {
    const frequency: Record<string, number> = {};
    for (const char of str) {
      if (frequency[char]) {
        frequency[char]++;
      } else {
        frequency[char] = 1;
      }
    }
    return frequency;
  };

  const textFrequency = countCharacters(text.toLowerCase());
  const queryFrequency = countCharacters(query.toLowerCase());

  for (const char in queryFrequency) {
    if (!textFrequency[char] || textFrequency[char] < queryFrequency[char]) {
      return false;
    }
  }
  return true;
};
