export class Currency {
    constructor(public code: string,
        public name: string) {
    }

    toString(): string {
        return this.name ? `${this.code} - ${this.name}` : this.code;
    }
}
