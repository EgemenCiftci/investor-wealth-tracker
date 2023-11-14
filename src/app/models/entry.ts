import { AssetTypes } from "../enums/asset-types";
import { DebtTypes } from "../enums/debt-types";
import { Asset } from "./asset";
import { Debt } from "./debt";

export class Entry {
    constructor(public date: string, public assets = new Array<Asset>(), public debts = new Array<Debt>()) {
    }

    getTotalLiquidAssets(): number {
        return this.assets.filter(x => x.type === AssetTypes.liquid).map(x => x.value).reduce((x, y) => x + y, 0);
    }

    getTotalLongTermAssets(): number {
        return this.assets.filter(x => x.type === AssetTypes.longTerm).map(x => x.value).reduce((x, y) => x + y, 0);
    }

    getTotalPensionFundsAndSimilarAssets(): number {
        return this.assets.filter(x => x.type === AssetTypes.pensionFundsAndSimilar).map(x => x.value).reduce((x, y) => x + y, 0);
    }

    getTotalAssets(): number {
        return this.assets.map(x => x.value).reduce((x, y) => x + y, 0);
    }

    getTotalShortTermDebts(): number {
        return this.debts.filter(x => x.type === DebtTypes.shortTerm).map(x => x.value).reduce((x, y) => x + y, 0);
    }

    getTotalLongTermDebts(): number {
        return this.debts.filter(x => x.type === DebtTypes.longTerm).map(x => x.value).reduce((x, y) => x + y, 0);
    }

    getTotalDebts(): number {
        return this.debts.map(x => x.value).reduce((x, y) => x + y, 0);
    }

    getTotalNetWorth(): number {
        return this.getTotalAssets() - this.getTotalDebts();
    }
}
