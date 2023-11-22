import { CurrencyTypes } from "../enums/currency-types";

export class Rate {
    constructor(public currency: CurrencyTypes,
        public value: number) {
    }
}
