import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment';
import { Rate } from '../models/rate';
import { lastValueFrom } from 'rxjs';
import { Currency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  base = 'USD';

  constructor(private httpClient: HttpClient) {
  }

  async getRates(date: string, currencyCodes: string[]): Promise<Rate[]> {
    const appId = environment.openExchangeRatesConfig.appId;
    const symbols = currencyCodes.join(',');
    const showAlternative = true;
    const url = `https://openexchangerates.org/api/historical/${date}.json?app_id=${appId}&base=${this.base}&symbols=${symbols}&show_alternative=${showAlternative}`;
    const response = (await lastValueFrom(this.httpClient.get(url))) as any;
    return Object.entries(response.rates).map(e => new Rate(e[0], e[1] as number));
  }

  async getCurrencies(): Promise<Currency[]> {
    const showAlternative = true;
    const url = `https://openexchangerates.org/api/currencies.json?show_alternative=${showAlternative}`;
    const response = (await lastValueFrom(this.httpClient.get(url))) as any;
    response.DOT = 'Polkadot';
    return Object.entries(response).map(e => new Currency(e[0], e[1] as string));
  }
}
