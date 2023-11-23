import { NameValueCurrency } from './name-value-currency';

describe('NameValue', () => {
  it('should create an instance', () => {
    expect(new NameValueCurrency('', 0, 'EUR')).toBeTruthy();
  });
});
