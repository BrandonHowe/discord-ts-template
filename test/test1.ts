import { expect } from "chai";
import { parseString } from "../src/index";

describe("Type parsing", () => {
    it("Parses strings, numbers, and bools", () => {
        const text = "function blah(arg1: string, arg2: number): bool => {}";
        expect(parseString(text)).to.deep.equal([
            "Function: (StringKeyword, NumberKeyword) => bool"
        ]);
    });
    it("Parses generics", () => {
        const text =
            "function blah<T, U extends string>(arg1: T, arg2: U): T => {}";
        expect(parseString(text)).to.deep.equal([
            "Function: <T, U extends StringKeyword>(T, U) => T"
        ]);
    });
    it("Parses union types", () => {
        const text =
            "function blah(arg1: string | number): string & number => {}";
        expect(parseString(text)).to.deep.equal([
            "Function: ((StringKeyword | NumberKeyword)) => (StringKeyword & NumberKeyword)"
        ]);
    });
    it("Parses array types", () => {
        const text = "function blah(arg1: string[]): number[][][] => {}";
        expect(parseString(text)).to.deep.equal([
            "Function: (StringKeyword[]) => NumberKeyword[][][]"
        ]);
    });
    it("Parses non-nullable types", () => {
        const text = "function blah(arg1: string!): number => {}";
        expect(parseString(text)).to.deep.equal([
            "Function: (StringKeyword!) => NumberKeyword"
        ]);
    });
    it("Parses nullable types", () => {
        const text = "function blah(arg1: string?): number => {}";
        expect(parseString(text)).to.deep.equal([
            "Function: (StringKeyword?) => NumberKeyword"
        ]);
    });
    it("Parses advanced types", () => {
        const text =
            "function blah(arg1: Record<string, string>): Array<number> => {}";
        expect(parseString(text)).to.deep.equal([
            "Function: (Record<StringKeyword, StringKeyword>) => Array<NumberKeyword>"
        ]);
    });
    it("Parses function types", () => {
        const text = "function blah(arg1: <T>(v: T) => string): number => {}";
        expect(parseString(text)).to.deep.equal([
            "Function: (<T>(T) => StringKeyword) => NumberKeyword"
        ]);
    });
});
