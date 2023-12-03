import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { lastValueFrom } from 'rxjs';
import { Currency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  base = 'USD';

  constructor(private httpClient: HttpClient) {
  }

  async getRates(date: Date, currencyCodes: string[]): Promise<{[key: string]:number}> {
    const dateString = this.formatDate(date);
    const appId = environment.openExchangeRatesConfig.appId;
    const symbols = currencyCodes.join(',');
    const showAlternative = true;
    const url = `https://openexchangerates.org/api/historical/${dateString}.json?app_id=${appId}&base=${this.base}&symbols=${symbols}&show_alternative=${showAlternative}`;
    const response = (await lastValueFrom(this.httpClient.get(url))) as any;
    return response.rates as {[key: string]:number};
  }

  async getCurrencies(): Promise<Currency[]> {
    const showAlternative = true;
    const url = `https://openexchangerates.org/api/currencies.json?show_alternative=${showAlternative}`;
    const response = (await lastValueFrom(this.httpClient.get(url))) as any;
    response.DOT = 'Polkadot';
    return Object.entries(response).map(e => new Currency(e[0], e[1] as string));
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
