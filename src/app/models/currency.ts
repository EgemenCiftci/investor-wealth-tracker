export class Currency {
    constructor(public code: string,
        public name: string) {
    }

    toString(): string {
        return `${this.code} - ${this.name}`;
    }
}
