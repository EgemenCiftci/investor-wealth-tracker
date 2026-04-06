export interface RatesResponse {
    rates: { [key: string]: number };
    base: string;
    date: string;
}
