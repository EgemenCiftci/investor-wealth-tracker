import { DebtTypes } from '../enums/debt-types';
import { Debt } from './debt';

describe('Debt', () => {
  it('should create an instance', () => {
    expect(new Debt(DebtTypes.shortTerm, '', 0, 'EUR')).toBeTruthy();
  });
});
