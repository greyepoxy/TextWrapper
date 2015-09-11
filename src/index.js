
export function Wrapper() {}

/**
 * Wraps the given text so that no single line is longer than the given colNum.
 * Will also break on word boundaries if possible.
 * @param  {string} text   to wrap.
 * @param  {number} colNum maximum column length for a single line of text.
 * @return {string}        text but with line breaks inserted.
 */
Wrapper.wrap = function wrap(text, colNum) {
  if (text.length < colNum) {
    return text;
  }

  return text.slice(0, colNum) + '\n' + text.substr(colNum);
};
