import { AssetTypes } from "../enums/asset-types";
import { NameValueCurrency } from "./name-value-currency";

export class Asset extends NameValueCurrency {
    constructor(public type: AssetTypes,
        name: string,
        value: number,
        currencyCode: string) {
        super(name, value, currencyCode);
    }
}
