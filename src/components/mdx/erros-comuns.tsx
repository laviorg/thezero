export type ErroComum = {
  problema: string;
  causa: string;
  solucao: string;
};

export function ErrosComuns({
  itens,
}: {
  itens: ErroComum[];
}) {
  return (
    <section className="erros-comuns my-10 min-w-0">
      <h2 className="article-h2">Erros comuns</h2>
      <ol className="my-3.5 list-decimal space-y-4 pl-5 leading-[1.72]">
        {itens.map((item) => (
          <li key={item.problema} className="pl-1">
            <p>
              <strong className="text-fg">{item.problema}</strong>
              {" → "}
              {item.causa}
              {" → "}
              {item.solucao}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
