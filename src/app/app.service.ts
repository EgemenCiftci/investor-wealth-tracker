import { Injectable } from '@angular/core';
import { Entry } from './models/entry';
import { Asset } from './models/asset';
import { AssetTypes } from './enums/asset-types';
import { Debt } from './models/debt';
import { DebtTypes } from './enums/debt-types';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  entries: Entry[] = [];

  constructor() {
  }
}
