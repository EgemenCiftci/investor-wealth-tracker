import { DebtTypes } from "../enums/debt-types";
import { NameValue } from "./name-value";

export class Debt extends NameValue {
    constructor(public type: DebtTypes,
        name: string,
        value: number) {
        super(name, value);
    }
}
