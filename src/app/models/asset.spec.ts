import { AssetTypes } from '../enums/asset-types';
import { CurrencyTypes } from '../enums/currency-types';
import { Asset } from './asset';

describe('Asset', () => {
  it('should create an instance', () => {
    expect(new Asset(AssetTypes.liquid, '', 0, CurrencyTypes.EUR)).toBeTruthy();
  });
});
