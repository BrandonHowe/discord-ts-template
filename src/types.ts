export interface TypeNode {
    name: string;
}

export interface FunctionArgument extends TypeNode {
    name: "Argument";
    text: string;
    type: string;
}

export interface VariableNode extends TypeNode {
    name: "Variable";
    text: string;
    type: string;
}

export interface FunctionNode extends TypeNode {
    name: "Function";
    text: string;
    type: string;
}

export interface ClassNode extends TypeNode {
    name: "Class";
    text: string;
    constructor: ConstructorNode;
    getters: GetterNode[];
    setters: SetterNode[];
    methods: MethodNode[];
    properties: PropertyNode[];
}

export interface PropertyNode extends TypeNode {
    name: "Property";
    text: string;
    type: string;
}

export interface GetterNode extends TypeNode {
    name: "Getter";
    text: string;
    type: string;
}

export interface SetterNode extends TypeNode {
    name: "Setter";
    text: string;
    type: string;
}

export interface MethodNode extends TypeNode {
    name: "Method";
    text: string;
    type: string;
}

export interface ConstructorNode extends TypeNode {
    name: "Constructor";
    arguments: FunctionArgument[];
}

export const isMethodNode = (node: TypeNode): node is MethodNode =>
    node.name === "Method";
export const isGetterNode = (node: TypeNode): node is GetterNode =>
    node.name === "Getter";
export const isSetterNode = (node: TypeNode): node is SetterNode =>
    node.name === "Setter";
export const isPropertyNode = (node: TypeNode): node is PropertyNode =>
    node.name === "Property";
export const isConstructorNode = (node: TypeNode): node is ConstructorNode =>
    node.name === "Constructor";
