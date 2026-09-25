import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { categoryMenus } from "./site-nav.ts";

describe("categoryMenus", () => {
  it("lists live subcategories under the parent editoria and omits the rest", () => {
    const menus = categoryMenus([
      {
        parent: "jogos",
        href: "/jogos/consoles",
        label: "Consoles e portáteis",
      },
    ]);

    assert.deepEqual(
      menus.map((menu) => menu.label),
      [
        "Tecnologia",
        "IA",
        "Computadores",
        "Dispositivos",
        "Aplicativos",
        "Jogos",
      ],
    );

    const jogos = menus.find((menu) => menu.id === "jogos");
    assert.ok(jogos);
    assert.equal(jogos.href, "/jogos");
    assert.equal(jogos.menuLabel, "Assuntos");
    assert.deepEqual(jogos.links, [
      { href: "/jogos/consoles", label: "Consoles e portáteis" },
    ]);

    const tecnologia = menus.find((menu) => menu.id === "tecnologia");
    assert.ok(tecnologia);
    assert.deepEqual(tecnologia.links, []);

    for (const menu of menus) {
      assert.equal(menu.href.startsWith("/reviews"), false);
      for (const link of menu.links) {
        assert.equal(link.href.startsWith("/reviews"), false);
        assert.match(link.href, /^\/[^/]+\/[^/]+$/);
      }
    }
  });
});
