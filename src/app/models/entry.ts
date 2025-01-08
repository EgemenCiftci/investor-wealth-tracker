import { Asset } from "./asset";
import { Debt } from "./debt";

export class Entry {
    constructor(public date: Date,
        public rates: { [key: string]: number },
        public assets: Array<Asset>,
        public debts: Array<Debt>) {
    }

    updateRates(base: string) {
        const assetCurrencyCodes = this.assets.map(a => a.currencyCode);
        const debtCurrencyCodes = this.debts.map(d => d.currencyCode);
        const currencyCodes = assetCurrencyCodes.reduce((acc, item) => {
            if (!acc.includes(item)) {
                acc.push(item);
            }
            return acc;
        }, debtCurrencyCodes).sort((a, b) => a.localeCompare(b));

        // Add new rates
        currencyCodes.forEach(c => {
            if (!this.rates.hasOwnProperty(c)) {
                this.rates[c] = c === base ? 1 : 0;
            }
        });

        // Remove non-existing rates
        Object.keys(this.rates).forEach(k => {
            if (k !== base && !currencyCodes.some(c => k === c)) {
                delete this.rates[k];
            }
        });
    }
}
