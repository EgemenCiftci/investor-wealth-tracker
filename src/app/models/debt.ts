import { CurrencyTypes } from "../enums/currency-types";
import { DebtTypes } from "../enums/debt-types";
import { NameValueCurrency } from "./name-value-currency";

export class Debt extends NameValueCurrency {
    constructor(public type: DebtTypes,
        name: string,
        value: number,
        currency: CurrencyTypes) {
        super(name, value, currency);
    }
}
