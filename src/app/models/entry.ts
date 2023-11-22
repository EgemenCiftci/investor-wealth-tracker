import { Asset } from "./asset";
import { Debt } from "./debt";
import { Rate } from "./rate";

export class Entry {
    constructor(public date: string,
        public rates: Array<Rate>,
        public assets: Array<Asset>,
        public debts: Array<Debt>) {
    }
}
