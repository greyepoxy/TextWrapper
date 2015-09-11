import {Wrapper} from '../src/index';

describe('Wrapper', () => {
  it('A Test Case', () => {
    const textIn = 'text';
    const colNum = 10;
    expect(Wrapper.wrap(textIn, colNum)).toEqual(textIn);
  });
});
