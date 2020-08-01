import mediaQuery from 'css-mediaquery';

export default (width) => {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
};

test('null', () => {});
