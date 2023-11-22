import { CurrencyTypes } from '../enums/currency-types';
import { Rate } from './rate';

describe('Rate', () => {
  it('should create an instance', () => {
    expect(new Rate(CurrencyTypes.EUR, 0)).toBeTruthy();
  });
});
