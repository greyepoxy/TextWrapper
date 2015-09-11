
export function Wrapper() {}

/**
 * Wraps the given text so that no single line is longer than the given colNum.
 * Will also break on word boundaries if possible.
 * @param  {string} text   to wrap.
 * @param  {number} colNum maximum column length for a single line of text.
 * @return {string}        text but with line breaks inserted.
 */
Wrapper.wrap = function wrap(text, colNum) {
  if (text.length <= colNum) {
    return text;
  }

  const lastSpaceBeforeCol = text.lastIndexOf(' ', colNum);
  let splitLoc = colNum;
  let splitDiff = 0;
  if (lastSpaceBeforeCol === colNum - 1) {
    splitLoc--;
    splitDiff = 1;
  } else if (lastSpaceBeforeCol > 0) {
    splitLoc = lastSpaceBeforeCol;
    splitDiff = 1;
  }

  return text.slice(0, splitLoc) + '\n' + Wrapper.wrap(text.substr(splitLoc + splitDiff), colNum);
};
