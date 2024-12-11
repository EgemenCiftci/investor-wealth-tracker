import { Entry } from './entry';

describe('Entry', () => {
  it('should create an instance', () => {
    expect(new Entry(new Date(), {}, [], [])).toBeTruthy();
  });
});
