/**
 * Transforma "## Fontes" + a lista seguinte em <Fontes count={N}>lista</Fontes>.
 * Aplica o componente em todas as matérias sem reescrever o MDX.
 */
type Node = { type: string; depth?: number; value?: string; children?: Node[] };

function text(node: Node): string {
  if (node.value) return node.value;
  return (node.children ?? []).map(text).join("");
}

export function remarkFontes() {
  return (tree: Node) => {
    const kids = tree.children ?? [];
    for (let i = 0; i < kids.length - 1; i++) {
      const h = kids[i];
      const list = kids[i + 1];
      if (
        h.type === "heading" &&
        h.depth === 2 &&
        /^fontes\b/i.test(text(h).trim()) &&
        list.type === "list"
      ) {
        const n = (list.children ?? []).length;
        kids.splice(i, 2, {
          type: "mdxJsxFlowElement",
          name: "Fontes",
          attributes: [{ type: "mdxJsxAttribute", name: "count", value: String(n) }],
          children: [list],
        } as unknown as Node);
      }
    }
  };
}
