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
});
