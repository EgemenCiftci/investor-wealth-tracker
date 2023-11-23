import { AssetTypes } from '../enums/asset-types';
import { Asset } from './asset';

describe('Asset', () => {
  it('should create an instance', () => {
    expect(new Asset(AssetTypes.liquid, '', 0, 'EUR')).toBeTruthy();
  });
});
