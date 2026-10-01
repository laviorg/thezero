import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const target = path.join(root, "src", `${specifier.slice(2)}.ts`);
    return nextResolve(pathToFileURL(target).href, context);
  }
  return nextResolve(specifier, context);
}
