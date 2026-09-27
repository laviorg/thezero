import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { factCheckIssues } from "./check-posts.mjs";

const valid = `## FACT-CHECK
- claim: A ficha lista 84 GB | source: https://www.nvidia.com/en-us/products/rtx-pro-5500/ | ok
- claim: A Reuters publicou em 27 de setembro de 2026 | source: https://www.reuters.com/technology/china-chips | ok
`;

describe("FACT-CHECK", () => {
  it("aceita o bloco com fonte primária e ok", () => {
    assert.deepEqual(factCheckIssues(valid), []);
  });

  it("aceita heading em negrito e para antes do SOCIAL PACKAGE", () => {
    const body = `**FACT-CHECK**
- 84 GB | https://www.nvidia.com/rtx | ok

## SOCIAL PACKAGE
- slug: exemplo
- hook: sem ok e sem url
`;
    assert.deepEqual(factCheckIssues(body), []);
  });

  it("ignora o que vem depois do comentário de fechamento", () => {
    const body = `${valid}
<!-- CURSOR_AGENT_PR_BODY_END -->
- claim: isto não entra | source: https://example.com/x | revisar
`;
    assert.deepEqual(factCheckIssues(body), []);
  });

  it("falha se o bloco não existe", () => {
    const issues = factCheckIssues("## SOCIAL PACKAGE\n- slug: exemplo\n");
    assert.equal(issues.length, 1);
    assert.match(issues[0], /ausente/);
  });

  it("falha se o bloco está vazio", () => {
    const issues = factCheckIssues("## FACT-CHECK\n\n## SOCIAL PACKAGE\n");
    assert.equal(issues.length, 1);
    assert.match(issues[0], /vazio/);
  });

  it("falha se a linha não está marcada ok", () => {
    const issues = factCheckIssues(`## FACT-CHECK
- claim: A placa tem 84 GB | source: https://www.nvidia.com/rtx | revisar
`);
    assert.equal(issues.some((issue) => /não está marcada com ok/.test(issue)), true);
  });

  it("falha em not ok mesmo com a palavra ok no fim", () => {
    const issues = factCheckIssues(`## FACT-CHECK
- claim: A placa tem 84 GB | source: https://www.nvidia.com/rtx | not ok
`);
    assert.equal(issues.some((issue) => /não está marcada com ok/.test(issue)), true);
  });

  it("falha sem URL", () => {
    const issues = factCheckIssues(`## FACT-CHECK
- claim: A placa tem 84 GB | ok
`);
    assert.equal(issues.some((issue) => /sem URL/.test(issue)), true);
  });

  it("falha se o corpo do PR está vazio", () => {
    assert.match(factCheckIssues("")[0], /ausente/);
    assert.match(factCheckIssues("   ")[0], /ausente/);
  });
});
