import 'mocha';
import 'should';

describe('This should work', () => {
  it('Works!', () => {
    console.log('some stuff');
    (2).should.be.exactly(2).and.be.a.Number();
  });
});
