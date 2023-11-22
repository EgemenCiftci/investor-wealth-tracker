import { CurrencyTypes } from "../enums/currency-types";

export class NameValueCurrency {
    constructor(public name: string,
        public value: number,
        public currency: CurrencyTypes) {
    }
}
