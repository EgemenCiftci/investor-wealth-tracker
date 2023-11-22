import { AssetTypes } from "../enums/asset-types";
import { CurrencyTypes } from "../enums/currency-types";
import { NameValueCurrency } from "./name-value-currency";

export class Asset extends NameValueCurrency {
    constructor(public type: AssetTypes,
        name: string,
        value: number,
        currency: CurrencyTypes) {
        super(name, value, currency);
    }
}
