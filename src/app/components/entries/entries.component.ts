import { Component, OnInit } from '@angular/core';
import { number } from 'echarts';
import { AssetTypes } from '../../enums/asset-types';
import { DebtTypes } from '../../enums/debt-types';
import { Asset } from '../../models/asset';
import { Currency } from '../../models/currency';
import { Debt } from '../../models/debt';
import { Entry } from '../../models/entry';
import { DialogService } from '../../services/dialog.service';
import { EntriesService } from '../../services/entries.service';
import { RatesService } from '../../services/rates.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  entries: Entry[] | undefined = undefined;
  isBusy = false;
  assetTypes = Object.entries(AssetTypes);
  debtTypes = Object.entries(DebtTypes);
  currencies: Currency[] = [];
  filteredCurrencies: Currency[] = [];

  constructor(public entriesService: EntriesService,
    public ratesService: RatesService,
    private snackBarService: SnackBarService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    await this.load();
    this.currencies = await this.ratesService.getCurrencies();
    this.filteredCurrencies = this.currencies;
  }

  filter(event: any, entry: Entry) {
    this.updateRates(entry);
    const value = event.target.value;
    this.filteredCurrencies = this.currencies.filter(c => c.toString().toLowerCase().includes(value.toLowerCase()));
  }

  async save() {
    try {
      this.isBusy = true;
      this.dialogService.openDialog('Save', 'All changes will be saved. Do you want to continue?', [
        {
          content: 'Cancel', isInitialFocus: false, click: () => { }
        },
        {
          content: 'Ok', isInitialFocus: true, click: async () => {
            await this.entriesService.setEntries(this.entries ?? []);
            this.snackBarService.showSnackBar('Saved successfully!');
          }
        }]);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async load() {
    try {
      this.isBusy = true;
      this.entries = await this.entriesService.getEntries();
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  async cancel() {
    try {
      this.isBusy = true;
      this.dialogService.openDialog('Cancel', 'All changes will be reverted. Do you want to continue?', [
        {
          content: 'Cancel', isInitialFocus: false, click: () => { }
        },
        {
          content: 'Ok', isInitialFocus: true, click: async () => {
            this.entries = await this.entriesService.getEntries();
          }
        }]);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  addEntry() {
    try {
      this.isBusy = true;
      if (!this.entries) {
        this.entries = [];
      }
      const rate: any = {};
      rate[this.ratesService.base] = 1;
      this.entries.push(new Entry(new Date(), rate, [], []));
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  copyAndAddEntry(entry: Entry) {
    try {
      this.isBusy = true;
      if (!this.entries) {
        this.entries = [];
      }
      const assets = entry.assets.map(a => new Asset(a.type, a.name, a.value, a.currencyCode));
      const debts = entry.debts.map(d => new Debt(d.type, d.name, d.value, d.currencyCode));
      const rates = { ...entry.rates };
      this.entries.push(new Entry(new Date(), rates, assets, debts));
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  addAsset(entry: Entry) {
    try {
      this.isBusy = true;
      if (!entry.assets)
        entry.assets = [];
      entry.assets.push(new Asset(AssetTypes.liquid, '', 0, this.ratesService.base));
      this.updateRates(entry);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  addDebt(entry: Entry) {
    try {
      this.isBusy = true;
      if (!entry.debts)
        entry.debts = [];
      entry.debts.push(new Debt(DebtTypes.shortTerm, '', 0, this.ratesService.base));
      this.updateRates(entry);
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  private getCurrencyCodes(entry: Entry): string[] {
    const assetCurrencyCodes = entry.assets.map(a => a.currencyCode);
    const debtCurrencyCodes = entry.debts.map(d => d.currencyCode);
    const uniqueCurrencyCodes = assetCurrencyCodes.reduce((acc, item) => {
      if (!acc.includes(item)) {
        acc.push(item);
      }

      return acc;
    }, debtCurrencyCodes).sort();

    return uniqueCurrencyCodes;
  }

  removeEntry(entry: Entry) {
    try {
      this.isBusy = true;
      if (this.entries) {
        const index = this.entries.indexOf(entry);
        this.entries.splice(index, 1);
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  removeAsset(entry: Entry, asset: Asset) {
    try {
      this.isBusy = true;
      if (this.entries) {
        const assetIndex = entry.assets.indexOf(asset);
        entry.assets.splice(assetIndex, 1);
        this.updateRates(entry);
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  removeDebt(entry: Entry, debt: Debt) {
    try {
      this.isBusy = true;
      if (this.entries) {
        const debtIndex = entry.debts.indexOf(debt);
        entry.debts.splice(debtIndex, 1);
        this.updateRates(entry);
      }
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  updateRates(entry: Entry) {
    const currencyCodes = this.getCurrencyCodes(entry);

    // Add new rates
    currencyCodes.forEach(c => {
      if (!entry.rates.hasOwnProperty(c)) {
        entry.rates[c] = c === this.ratesService.base ? 1 : 0;
      }
    });

    // Remove non-existing rates
    Object.keys(entry.rates).forEach(k => {
      if (k !== this.ratesService.base && !currencyCodes.some(c => k === c)) {
        delete entry.rates[k];
      }
    });
  }

  async fillRates(entry: Entry) {
    try {
      this.isBusy = true;
      const rates = await this.ratesService.getRates(entry.date, Object.keys(entry.rates).filter(k => k !== this.ratesService.base));
      Object.entries(rates).forEach(e => {
        entry.rates[e[0]] = e[1];
      });
    } catch (error: any) {
      this.snackBarService.showSnackBar(error);
    } finally {
      this.isBusy = false;
    }
  }

  getCurrency(code: string): Currency {
    return this.currencies.find(c => c.code === code) ?? new Currency(code, '');
  }

  setRate(entry: Entry, key: string, event: Event) {
    entry.rates[key] = (event.target as any).value;
  }
}
