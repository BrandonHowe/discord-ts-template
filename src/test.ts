const blah = <T>(a: T) => Math.random();

const kek = 5;

const bloo: string | number = 5;

function goo(asdf: boolean) {
    return { bruh: 6 };
}

class mclass {
    test = 5;
    constructor() {}
    get getTest() {
        return this.test;
    }
    set setTest(val: number) {
        this.test = val;
    }
    static staticMethod() {
        console.log("boogaloo");
    }
    regularMethod() {
        console.log("blah");
    }
}
