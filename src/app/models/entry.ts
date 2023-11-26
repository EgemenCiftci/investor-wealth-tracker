import { Asset } from "./asset";
import { Debt } from "./debt";

export class Entry {
    constructor(public date: Date,
        public rates: { [key: string]: number },
        public assets: Array<Asset>,
        public debts: Array<Debt>) {
    }
}
