import * as ts from 'typescript';
import * as path from 'path';

function flattenType(node: ts.Node, path: string = '', result: string[] = []): string[] {
  if (ts.isArrayTypeNode(node)) {
    const newPath = `${path}[]`;
    flattenType(node.elementType, newPath, result);
  } else if (ts.isTypeReferenceNode(node)) {
    const newPath = path ? `${path}.${node.typeName.getText()}` : node.typeName.getText();

    // Check if the type reference is an interface or type in the source file
    const symbol = node.typeName && ts.isIdentifier(node.typeName) ? checker.getSymbolAtLocation(node.typeName) : null;
    const _declaration = symbol?.declarations?.[0];

    if (_declaration && (ts.isInterfaceDeclaration(_declaration) || ts.isTypeAliasDeclaration(_declaration))) {
      const declaration = _declaration as any;
      if (declaration.type) {
        flattenType(declaration.type, newPath, result);
      } else if (declaration.members) {
        for (const member of declaration.members) {
          if (ts.isPropertySignature(member) && member.type) {
            const memberPath = newPath ? `${newPath}.${member.name.getText()}` : member.name.getText();
            flattenType(member.type, memberPath, result);
          }
        }
      }
    } else {
      result.push(newPath);
    }
  } else if (ts.isTypeLiteralNode(node)) {
    for (const member of node.members) {
      if (ts.isPropertySignature(member) && member.type) {
        const memberPath = path ? `${path}.${member.name.getText()}` : member.name.getText();
        flattenType(member.type, memberPath, result);
      }
    }
  }

  return result;
}


function processFile(file: string) {
  const program = ts.createProgram([ file ], {});
  checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(file);

  if (!sourceFile) {
    console.error('Could not load the source file.');
    return;
  }

  const paths: string[] = [];

  let entryNode: any;

  ts.forEachChild(sourceFile, (node) => {
    if ((ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name['escapedText'] === 'Entry') {
      entryNode = node;
    }
  });

  if (entryNode) {
    if (entryNode.type) {
      paths.push(...flattenType(entryNode.type));
    } else if (entryNode.members) {
      for (const member of entryNode.members) {
        if (ts.isPropertySignature(member) && member.type) {
          const memberPath = entryNode.name.text ? `${entryNode.name.text}.${member.name.getText()}` : member.name.getText();
          flattenType(member.type, memberPath, paths);
        }
      }
    }
  }

  console.log(paths);
}

let checker: ts.TypeChecker;

// Process a given TypeScript file
const fileToProcess = path.join(process.cwd(), 'node_modules/@types/har-format/index.d.ts')
processFile(fileToProcess);
