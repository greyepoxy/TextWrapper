import {Wrapper} from '../src/index';

describe('Wrapper', () => {
  it('ShouldReturnEmptyGivenEmptyText', () => {
    const textIn = '';
    const colNum = 10;
    expect(Wrapper.wrap(textIn, colNum)).toEqual('');
  });

  it('ShouldReturnWithNoBreaksIfColNumIsLargerThenTextLength', () => {
    const textIn = 'text';
    const colNum = 10;
    expect(Wrapper.wrap(textIn, colNum)).toEqual(textIn);
  });

  it('ShouldSplitASingleWordAtColNum', () => {
    const textIn = 'word';
    const colNum = 2;
    expect(Wrapper.wrap(textIn, colNum)).toEqual('wo\nrd');
  });

  it('ShouldSplitAtWordBoundryIfColNumAlignsWithBoundry', () => {
    const textIn = 'word word';
    const colNum = 5;
    expect(Wrapper.wrap(textIn, colNum)).toEqual('word\nword');
  });
});
