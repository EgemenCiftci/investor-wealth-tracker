export interface RawEntries {
    [key: string]: {
        rates: { [key: string]: number };
        assets: { name: string; value: number; currencyCode: string }[];
        debts: { name: string; value: number; currencyCode: string }[];
    }
}
