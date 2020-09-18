import * as ts from "typescript";
import {
    ClassNode,
    ConstructorNode,
    FunctionArgument,
    FunctionNode,
    GetterNode,
    InterfaceNode,
    isConstructorNode,
    isGetterNode,
    isMethodNode,
    isPropertyNode,
    isSetterNode,
    MethodNode,
    PropertyNode,
    SetterNode,
    TypeAliasNode,
    TypeNode,
    VariableNode
} from "./types";

const filename = "./src/test.ts";
const program = ts.createProgram([filename], {});
const sourceFile = program.getSourceFile(filename)!;
const typeChecker = program.getTypeChecker();

type TSClassProperty =
    | ts.PropertyDeclaration
    | ts.ConstructorDeclaration
    | ts.GetAccessorDeclaration
    | ts.SetAccessorDeclaration
    | ts.MethodDeclaration;

const displayClassProperty = (
    node: TSClassProperty
): ClassNode[keyof Omit<ClassNode, "name" | "text">] => {
    if (ts.isConstructorDeclaration(node)) {
        const params = node.parameters.map(l => {
            const type = typeChecker.getTypeAtLocation(l);
            const typeName = typeChecker.typeToString(type, l);
            return {
                name: "Argument",
                text: node.name ? node.name.getText(sourceFile) : "anonymous",
                type: typeName
            } as FunctionArgument;
        });
        return {
            name: "Constructor",
            arguments: params
        } as ConstructorNode;
    }
    if (ts.isPropertyDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);
        return [
            {
                name: "Property",
                text: node.name.getText(sourceFile),
                type: typeName
            }
        ] as PropertyNode[];
    }
    if (ts.isGetAccessor(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);
        return [
            {
                name: "Getter",
                text: node.name.getText(sourceFile),
                type: typeName
            }
        ] as GetterNode[];
    }
    if (ts.isSetAccessor(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);
        return [
            {
                name: "Setter",
                text: node.name.getText(sourceFile),
                type: typeName
            }
        ] as SetterNode[];
    }
    if (ts.isMethodDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);
        return [
            {
                name: "Method",
                text: node.name.getText(sourceFile),
                type: typeName
            }
        ] as MethodNode[];
    }
    return [];
};

const recursivelyPrintVariableDeclarations = (
    node: ts.Node,
    sourceFile: ts.SourceFile
): TypeNode[] => {
    if (ts.isVariableDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);

        return [
            {
                name: "Variable",
                text: node.name.getText(sourceFile),
                type: typeName
            }
        ] as VariableNode[];
    }

    if (ts.isFunctionDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);

        return [
            {
                name: "Function",
                text: node.name ? node.name.getText(sourceFile) : "anonymous",
                type: typeName
            }
        ] as FunctionNode[];
    }

    if (ts.isClassDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);
        const properties = [] as (
            | ConstructorNode
            | GetterNode
            | SetterNode
            | MethodNode
            | PropertyNode
        )[];
        node.forEachChild(l => {
            const displayed = displayClassProperty(l as TSClassProperty);
            if (Array.isArray(displayed)) {
                properties.push(...displayed);
            } else {
                properties.push(displayed);
            }
        });
        return [
            {
                name: "Class",
                text: node.name ? node.name.getText(sourceFile) : "anonymous",
                methods: properties.filter(isMethodNode),
                setters: properties.filter(isSetterNode),
                getters: properties.filter(isGetterNode),
                properties: properties.filter(isPropertyNode),
                constructor: properties.find(isConstructorNode)!
            }
        ] as ClassNode[];
    }

    if (ts.isTypeAliasDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);
        return [
            {
                name: "TypeAlias",
                text: node.name.text,
                type: typeName
            }
        ] as TypeAliasNode[];
    }

    if (ts.isInterfaceDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);
        return [
            {
                name: "Interface",
                text: node.name.text,
                type: typeName
            }
        ] as InterfaceNode[];
    }

    const children = [] as TypeNode[];

    node.forEachChild(child => {
        children.push(
            ...recursivelyPrintVariableDeclarations(child, sourceFile)
        );
    });

    return children;
};

console.log(recursivelyPrintVariableDeclarations(sourceFile, sourceFile));
