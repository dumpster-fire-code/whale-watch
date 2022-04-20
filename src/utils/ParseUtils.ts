const toNumber = (text: string) => {
  return parseFloat(text.replace(/[^0-9.]/g, ''));
};

const splitNameAndParenthetical = (text: string): [string, string] => {
  const openingParenthesisIndex = text.indexOf('(');

  return [
    text.substring(0, openingParenthesisIndex).trim(),
    removeParentheses(text.substring(openingParenthesisIndex)),
  ];
};

const removeParentheses = (text: string) => text.replace(/[()]/g, '').trim();

export { removeParentheses, splitNameAndParenthetical, toNumber };
