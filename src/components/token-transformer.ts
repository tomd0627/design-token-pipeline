// In-browser replication of the Style Dictionary v4 transforms used in this project.
// Mirrors config/style-dictionary.config.mjs:
//   CSS  → kebab-case names, prefixed with "token", emitted as :root { --token-…: …; }
//   JS   → camelCase names, prefixed with "token", emitted as named ESM exports
//   TS   → same names as JS, emitted as TypeScript declarations

interface TokenLeaf {
  $type: string;
  $value: unknown;
}

type TokenTree = { [key: string]: TokenTree | TokenLeaf };

function isTokenLeaf(node: unknown): node is TokenLeaf {
  return (
    typeof node === "object" &&
    node !== null &&
    "$type" in node &&
    "$value" in node
  );
}

interface ResolvedToken {
  path: string[];
  type: string;
  value: unknown;
}

function walkTokens(
  node: TokenTree,
  path: string[] = [],
  results: ResolvedToken[] = [],
): ResolvedToken[] {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const nextPath = [...path, key];
    if (isTokenLeaf(child)) {
      results.push({ path: nextPath, type: child.$type, value: child.$value });
    } else {
      walkTokens(child as TokenTree, nextPath, results);
    }
  }
  return results;
}

function toKebabCase(parts: string[]): string {
  return parts
    .map((p) => p.replace(/([A-Z])/g, "-$1").toLowerCase())
    .join("-");
}

function toCamelCase(parts: string[]): string {
  return parts
    .map((p, i) =>
      i === 0 ? p.replace(/[-_](.)/g, (_, c: string) => c.toUpperCase()) : p.charAt(0).toUpperCase() + p.slice(1),
    )
    .join("");
}

function formatValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    // cubicBezier: [x1, y1, x2, y2]
    return `cubic-bezier(${(value as number[]).join(", ")})`;
  }
  if (typeof value === "object" && value !== null) {
    // shadow object
    const s = value as Record<string, string | number>;
    return `${s["offsetX"] ?? 0} ${s["offsetY"] ?? 0} ${s["blur"] ?? 0} ${s["spread"] ?? 0} ${s["color"] ?? "transparent"}`;
  }
  return String(value);
}

export function transformToCSS(json: TokenTree): string {
  const tokens = walkTokens(json);
  if (tokens.length === 0) return ":root {\n  /* no tokens found */\n}";

  const lines = tokens.map((t) => {
    const name = `--token-${toKebabCase(t.path)}`;
    return `  ${name}: ${formatValue(t.value)};`;
  });

  return `:root {\n${lines.join("\n")}\n}`;
}

export function transformToJS(json: TokenTree): string {
  const tokens = walkTokens(json);
  if (tokens.length === 0) return "// no tokens found";

  const lines = tokens.map((t) => {
    const name = `token${toCamelCase(t.path).charAt(0).toUpperCase() + toCamelCase(t.path).slice(1)}`;
    const value = formatValue(t.value);
    return `export const ${name} = "${value}";`;
  });

  return lines.join("\n");
}

export function transformToTS(json: TokenTree): string {
  const tokens = walkTokens(json);
  if (tokens.length === 0) return "// no tokens found";

  const lines = tokens.map((t) => {
    const camel = toCamelCase(t.path);
    const name = `token${camel.charAt(0).toUpperCase() + camel.slice(1)}`;
    const tsType = t.type === "number" ? "number" : "string";
    return `export declare const ${name}: ${tsType};`;
  });

  return lines.join("\n");
}
