import { AssetTypes } from "../enums/asset-types";
import { NameValue } from "./name-value";

export class Asset extends NameValue {
    constructor(public type: AssetTypes, name: string, value: number) {
        super(name, value);
    }
}
