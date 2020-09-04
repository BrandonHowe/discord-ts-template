import * as ts from "typescript";

const filename = "test.ts";
const code = `const id = <T>(val: T): T => val`;

const sourceFile = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest);

const Guard = <T, U extends T>(val: T, isTrue: boolean): val is U => isTrue;

const displayTypeString = (node: ts.Node): string => {
    if (ts.isLiteralTypeNode(node)) {
        const literal = node.literal;
        const nodeKind = ts.SyntaxKind[literal.kind];
        if (
            Guard<typeof literal, ts.StringLiteral>(
                literal,
                nodeKind === "StringLiteral"
            )
        ) {
            return literal.text;
        } else if (Guard<typeof literal, ts.BooleanLiteral>(
            literal,
            nodeKind === "BooleanLiteral"
        )) {
            return ts.SyntaxKind[literal.kind];
        } else if (Guard<typeof literal, ts.NumericLiteral>(
            literal,
            nodeKind === "FirstLiteralToken"
        )) {
            return literal.text;
        }
        return nodeKind;
    } else if (ts.isUnionTypeNode(node)) {
        const types = node.types!.map(displayTypeString);
        return `(${types.reduce(
            (acc: string, cur: string) =>
                (acc += acc === "" ? cur : ` | ${cur}`)
        )})`;
    } else if (ts.isIntersectionTypeNode(node)) {
        const types = node.types!.map(displayTypeString);
        return `(${types.reduce(
            (acc: string, cur: string) =>
                (acc += acc === "" ? cur : ` & ${cur}`)
        )})`;
    } else if (ts.isArrayTypeNode(node)) {
        const typeName = displayTypeString(node.elementType);
        return `[${typeName}]`;
    } else if (ts.isTypeReferenceNode(node)) {
        const name = ts.isIdentifier(node.typeName)
            ? node.typeName.escapedText
            : ts.SyntaxKind[node.typeName.kind];
        if (node.typeArguments) {
            const typeArgs = node.typeArguments!.map(displayTypeString);
            return `${name}<${typeArgs.reduce(
                (acc: string, cur: string) =>
                    (acc += acc === "" ? cur : `, ${cur}`)
            )}>`;
        } else if (node.typeName) {
            const typeName = node.typeName;
            if (ts.isIdentifier(typeName)) {
                return typeName.text;
            } else {
                return ts.SyntaxKind[node.kind]
            }
        } else {
            return `${name}<>`;
        }
    } else if (ts.isTypeParameterDeclaration(node)) {
        return "<T>"
    } else if (ts.isIdentifier(node)) {
        return node.text;
    } else if (ts.isIndexSignatureDeclaration(node)) {
        const names = node.parameters.map(l => displayTypeString(l.name));
        const types = node.parameters.map(l => l.type ? displayTypeString(l.type) : ts.SyntaxKind[node.kind]);
        const zipped = names.map((l, idx) => [l, types[idx]]);
        return `[${zipped.reduce((acc, cur) => acc += (`${acc === "" ? "" : ", "}${cur[0]}: ${cur[1]}`), "")}]`
    } else if (ts.isJSDocNullableType(node)) {
        return `${displayTypeString(node.type)}?`;
    } else if (ts.isJSDocNonNullableType(node)) {
        return `${displayTypeString(node.type)}!`;
    } else if (ts.isTypeLiteralNode(node)) {
        const names = node.members.map(l => ts.isIndexSignatureDeclaration(l) ? l.name || displayTypeString(l) : l.name ? displayTypeString(l.name) : "err");
        // TODO: Get rid of this ts-ignore
        // @ts-ignore
        const types = node.members.map(l => l.type ? displayTypeString(l.type) : "err");
        const zipped = names.map((l, idx) => ({ name: l, type: types[idx] }));
        return `{ ${zipped.reduce((acc, cur) => acc += `${acc === "" ? "" : ", "}${cur.name}: ${cur.type}`, "") } }`
    } else if (ts.isFunctionTypeNode(node)) {
        const paramTypes = node.parameters.map(l => ({ name: displayTypeString(l.name), type: l.type ? displayTypeString(l.type) : "err" }));
        const returnType = displayTypeString(node.type);
	return `(${paramTypes.reduce((acc, cur) => acc += `${acc === "" ? "" : ", "}${cur.type}`, "")}) => ${returnType}`;
    } else if (ts.isTypeReferenceNode(node)) {
        const name = node.typeName;
        const args = node.typeArguments;
        return `${name}${args ? `<${args.reduce((acc, cur) => acc += `${acc === "" ? "" : ", "}${cur}`, "")}>`: "" }`

    }
    console.log(node);
    return ts.SyntaxKind[node.kind];
};

function printRecursiveFrom(
    node: ts.Node,
    indentLevel: number,
    sourceFile: ts.SourceFile
) {
    const indentation = "-".repeat(indentLevel);
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(sourceFile);
    // console.log(`${indentation}${syntaxKind}: ${nodeText}`);

    if (ts.isFunctionDeclaration(node)) {
        const generics = node.typeParameters && node.typeParameters.map(l => `${l.name.text}${l.constraint ? ` extends ${displayTypeString(l.constraint)}` : ""}`);
        const genericConstraints = node.typeParameters && node.typeParameters.map(l => l.constraint);
        const genericsString = generics && `<${generics.reduce((acc, cur) => acc += ` ${cur}`)}>`;
        const args = node.parameters.map(l => displayTypeString(l.type!));
        const output = displayTypeString(node.type!);
        console.log(
            `Function: ${genericsString || ""}(${args.reduce(
                (acc, cur) => (acc += acc === "" ? cur : ", " + cur)
            )}): ${output}`
        );
    }

    node.forEachChild(child =>
        printRecursiveFrom(child, indentLevel + 1, sourceFile)
    );
}

printRecursiveFrom(<ts.Node>(<unknown>sourceFile), 0, sourceFile);
