import { Asset } from "./asset";
import { Debt } from "./debt";

export class Entry {
    constructor(public date: string,
        public assets: Array<Asset>,
        public debts: Array<Debt>) {
    }
}
