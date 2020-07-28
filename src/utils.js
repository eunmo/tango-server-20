const get = (url, callback) => {
  fetch(url)
    .then((response) => response.json())
    .then(callback);
};

const sortWordsByPattern = (patterns, words) => {
  const localeOption = { sensitivity: 'base', ignorePunctuation: true };
  const localeCompare = (a, b) => a.localeCompare(b, 'fr', localeOption) === 0;

  const exact = [];
  const startsWith = [];
  const remainder = [];
  words.forEach((word) => {
    const filtered = patterns.some((pattern) => {
      return ['word', 'yomigana', 'meaning'].some((key) => {
        if (localeCompare(word[key], pattern)) {
          exact.push(word);
          return true;
        }

        if (localeCompare(word[key].substring(0, pattern.length), pattern)) {
          startsWith.push(word);
          return true;
        }

        return false;
      });
    });
    if (!filtered) {
      remainder.push(word);
    }
  });

  return [...exact, ...startsWith, ...remainder];
};

export { get, sortWordsByPattern };
