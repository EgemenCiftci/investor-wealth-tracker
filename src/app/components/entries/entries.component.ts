import { Component, OnInit } from '@angular/core';
import { AssetTypes } from 'src/app/enums/asset-types';
import { DebtTypes } from 'src/app/enums/debt-types';
import { Asset } from 'src/app/models/asset';
import { Currency } from 'src/app/models/currency';
import { Debt } from 'src/app/models/debt';
import { Entry } from 'src/app/models/entry';
import { Rate } from 'src/app/models/rate';
import { DialogService } from 'src/app/services/dialog.service';
import { EntriesService } from 'src/app/services/entries.service';
import { RatesService } from 'src/app/services/rates.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

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
      this.entries.push(new Entry(this.formatDate(new Date()), [new Rate(this.ratesService.base, 1)], [], []));
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
      const rates = entry.rates.map(r => new Rate(r.currencyCode, r.value));
      this.entries.push(new Entry(this.formatDate(new Date()), rates, assets, debts));
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

  private getRates(entry: Entry): Rate[] {
    const assetCurrencyCodes = entry.assets.map(a => a.currencyCode);
    const debtCurrencyCodes = entry.debts.map(d => d.currencyCode);
    const uniqueCurrencyCodes = assetCurrencyCodes.reduce((acc, item) => {
      if (!acc.includes(item)) {
        acc.push(item);
      }

      return acc;
    }, debtCurrencyCodes).sort();

    return uniqueCurrencyCodes.map(c => new Rate(c, c === this.ratesService.base ? 1 : 0));
  }

  onDateChange(event: any, entry: Entry) {
    entry.date = this.formatDate(event.value);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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
    const rates = this.getRates(entry);

    // Add new rates
    rates.forEach(r => {
      if (!entry.rates.some(er => er.currencyCode === r.currencyCode)) {
        entry.rates.push(r);
      }
    });

    // Remove non-existing rates
    entry.rates.forEach(er => {
      if (er.currencyCode !== this.ratesService.base && !rates.some(r => er.currencyCode === r.currencyCode)) {
        const rateIndex = entry.rates.indexOf(er);
        entry.rates.splice(rateIndex, 1);
      }
    });

    // Sort
    entry.rates.sort((a, b) => {
      if (a.currencyCode < b.currencyCode) {
        return -1;
      }

      if (a.currencyCode > b.currencyCode) {
        return 1;
      }

      return 0;
    });
  }

  async fillRates(entry: Entry) {
    try {
      this.isBusy = true;
      const rates = await this.ratesService.getRates(entry.date, entry.rates.filter(r => r.currencyCode !== this.ratesService.base).map(r => r.currencyCode));
      entry.rates.forEach(er => {
        const r = rates.find(x => x.currencyCode === er.currencyCode);
        if (r) {
          er.value = r.value;
        }
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
}
