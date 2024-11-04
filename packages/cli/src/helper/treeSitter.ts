import Javascript from "tree-sitter-javascript";
import Typescript from "tree-sitter-typescript";

export function getParserLanguageFromFile(filePath: string) {
  const ext = filePath.split(".").pop();

  switch (ext) {
    case "js":
      return Javascript;
    case "ts":
      return Typescript.typescript;
    case "tsx": // TODO this is untested
      return Typescript.tsx;
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}
