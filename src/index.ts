import * as ts from "typescript";

const filename = "test.ts";
const program = ts.createProgram([filename], {});
const sourceFile = program.getSourceFile(filename)!;
const typeChecker = program.getTypeChecker();

function recursivelyPrintVariableDeclarations(
    node: ts.Node, sourceFile: ts.SourceFile
) {
    if (ts.isVariableDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);

        console.log(`${node.name.getText(sourceFile)}: ${typeName}`);
    }

    if (ts.isFunctionDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);

        console.log(`${node.name!.getText(sourceFile)}: ${typeName}`);
    }

    if (ts.isClassDeclaration(node)) {
        const type = typeChecker.getTypeAtLocation(node);
        const typeName = typeChecker.typeToString(type, node);
        node.forEachChild(l => console.log(ts.isConstructorDeclaration(l)));
        node.forEachChild(l => console.log(ts.SyntaxKind[l.kind]));

        console.log(`${node.name!.getText(sourceFile)}: ${typeName}`);
    }

    node.forEachChild(child =>
        recursivelyPrintVariableDeclarations(child, sourceFile)
    );
}

recursivelyPrintVariableDeclarations(sourceFile, sourceFile);
