import { CurrencyTypes } from '../enums/currency-types';
import { NameValueCurrency } from './name-value-currency';

describe('NameValue', () => {
  it('should create an instance', () => {
    expect(new NameValueCurrency('', 0, CurrencyTypes.EUR)).toBeTruthy();
  });
});
