import { CamelCaseToSpacesPipe } from './camel-case-to-spaces.pipe';

describe('CamelCaseToSpacesPipe', () => {
  it('create an instance', () => {
    const pipe = new CamelCaseToSpacesPipe();
    expect(pipe).toBeTruthy();
  });
});
