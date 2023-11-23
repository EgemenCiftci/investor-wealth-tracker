import { Rate } from './rate';

describe('Rate', () => {
  it('should create an instance', () => {
    expect(new Rate('EUR', 0)).toBeTruthy();
  });
});
