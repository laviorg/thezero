import { ManageCookiesButton } from "@/components/consent/manage-cookies-button";
import { LegalDocument } from "@/components/layout/legal-document";
import { LegalPageJsonLd } from "@/components/news/json-ld";
import { googlePolicy, LEGAL_UPDATED_LABEL } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { PRIVACY_TITLE } from "@/lib/titles";
import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Como o The Zero trata dados, cookies e terceiros (incluindo Google Analytics e, quando ligado, AdSense), e quais são os seus direitos sob a LGPD.";

export const metadata: Metadata = buildPageMetadata({
  title: PRIVACY_TITLE,
  description,
  path: "/privacidade",
  brand: "never",
  imagePath: "/opengraph-image",
  imageAlt: PRIVACY_TITLE,
});

export default function PrivacyPage() {
  return (
    <LegalDocument
      kicker="Privacidade"
      title="O que a gente coleta — e o que não."
      lede="Política em português, alinhada à LGPD. Sem conta, sem newsletter, sem fingir que não existe cookie de estatística ou de anúncio."
      updated={LEGAL_UPDATED_LABEL}
      jsonLd={<LegalPageJsonLd path="/privacidade" name={PRIVACY_TITLE} description={description} />}
    >
      <p>
        The Zero (“nós”) publica o newsroom{" "}
        <a href={site.url}>{site.domain}</a>. Esta página descreve quais dados
        tratamos, por quê, com quem e quais são os seus direitos sob a Lei
        Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
      </p>
      <p>
        <strong>Controlador:</strong> The Zero, newsroom de tecnologia publicado
        no Brasil. <strong>Canal:</strong>{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Não pedimos CPF, não
        temos cadastro de leitor e não vendemos lista.
      </p>

      <h2>1. Que dados tratamos</h2>
      <p>
        Hoje o site <strong>não tem conta, comentário, newsletter nem
        formulário</strong> que peça nome ou documento. Ainda assim, alguns
        dados circulam para o newsroom funcionar:
      </p>
      <ul>
        <li>
          <strong>Dados técnicos de acesso.</strong> Ao abrir uma página, a
          hospedagem (hoje, Vercel) registra no curso normal da web: endereço
          IP, data/hora, URL, referrer, user-agent e código de status. Serve
          para entregar a página, diagnosticar falha e conter abuso — não para
          a gente montar um perfil publicitário próprio.
        </li>
        <li>
          <strong>Preferências no seu aparelho.</strong> Tema claro/escuro
          (`thezero-theme`) e a escolha deste aviso de cookies
          (`thezero-consent`) ficam no <em>localStorage</em> do navegador. Não
          sincronizamos isso com um cadastro.
        </li>
        <li>
          <strong>O que você nos manda de propósito.</strong> E-mail para{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> ou mensagem no{" "}
          <a href={site.social.instagram} rel="noopener noreferrer">
            Instagram
          </a>{" "}
          /{" "}
          <a href={site.social.youtube} rel="noopener noreferrer">
            YouTube
          </a>{" "}
          — tratamos o que você enviou para responder pauta, correção ou
          parceria.
        </li>
        <li>
          <strong>Estatística (só com aceite).</strong> O Google Analytics 4
          mede audiência agregada: páginas vistas, referrer, tipo de
          dispositivo, idioma e sinais semelhantes. Só carrega o script do
          Google (gtag) se você aceitar no aviso de cookies. Recusar (“Só
          o necessário”) não dispara o script. Sem cadastro nosso: a
          medição fica no Google, não num perfil que a gente monta.
        </li>
        <li>
          <strong>Publicidade (só com aceite, e só quando o AdSense estiver
          ligado).</strong> O Google AdSense e parceiros certificados podem
          usar cookies, identificadores, endereço IP e sinais semelhantes para
          servir, medir e, se você permitir, personalizar anúncios. Isso{" "}
          <strong>não está no ar</strong> até a conta ser aprovada e o site
          publicar o código. Quando estiver, vale esta mesma política — e o
          mesmo aceite do aviso de cookies.
        </li>
      </ul>

      <h2>2. Bases legais (LGPD)</h2>
      <ul>
        <li>
          <strong>Legítimo interesse</strong> (art. 7º, IX): logs técnicos,
          segurança e funcionamento do newsroom.
        </li>
        <li>
          <strong>Consentimento</strong> (art. 7º, I): cookies e identificadores
          de estatística (Google Analytics) e de publicidade (AdSense, quando
          ligado). Dá para recusar e depois mudar de ideia.
        </li>
        <li>
          <strong>Legítimo interesse / exercício regular de direito:</strong>{" "}
          responder e-mail de pauta, correção ou denúncia, e guardar o
          necessário se houver disputa.
        </li>
      </ul>
      <p>
        Não fazemos decisão automatizada que produza efeito jurídico sobre
        você. Não misturamos o que o Google reporta de forma agregada com
        dados que te identifiquem — e não pedimos que o Google faça isso no
        nosso lugar.
      </p>

      <h2>3. Cookies e tecnologias semelhantes</h2>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>O que faz</th>
            <th>Aceite?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Necessários</td>
            <td>
              Entregar a página, lembrar o tema, lembrar se você já respondeu
              o aviso
            </td>
            <td>Não — são do serviço</td>
          </tr>
          <tr>
            <td>Estatística</td>
            <td>
              Google Analytics 4: páginas vistas, referrer, dispositivo —
              só depois do aceite
            </td>
            <td>Sim (mesmo aceite da publicidade)</td>
          </tr>
          <tr>
            <td>Publicidade</td>
            <td>
              Google AdSense e parceiros: cookies, pixels, IP, medição e (se
              permitido) personalização
            </td>
            <td>Sim</td>
          </tr>
        </tbody>
      </table>
      <p>
        Estatística e publicidade se gerenciam neste site pelo aviso de
        cookies (rodapé). Anúncios do Google, quando existirem, também em{" "}
        <a href={googlePolicy.adSettings} rel="noopener noreferrer">
          adssettings.google.com
        </a>
        .
      </p>
      <p>Como o Google usa dados quando um site usa produtos Google:</p>
      <ul>
        <li>
          <a href={googlePolicy.partnerSites} rel="noopener noreferrer">
            How Google uses information from sites or apps that use our
            services
          </a>
        </li>
        <li>
          <a href={googlePolicy.privacy} rel="noopener noreferrer">
            Política de Privacidade do Google
          </a>
        </li>
        <li>
          <a href={googlePolicy.ads} rel="noopener noreferrer">
            Como o Google usa cookies em publicidade
          </a>
        </li>
        <li>
          <a href={googlePolicy.analytics} rel="noopener noreferrer">
            Proteção de dados no Google Analytics
          </a>
        </li>
      </ul>
      <p>
        <ManageCookiesButton />
      </p>

      <h2>4. Com quem compartilhamos</h2>
      <ul>
        <li>
          <strong>Vercel</strong> — hospedagem e entrega do site.
        </li>
        <li>
          <strong>Google</strong> — Analytics 4 (medição de audiência, só com
          aceite) e AdSense, quando o código de anúncio estiver publicado e
          houver o mesmo aceite.
        </li>
        <li>
          <strong>Autoridade ou ordem legal</strong> — se a lei exigir.
        </li>
        <li>
          Prestadores pontuais (e-mail, DNS, registro do domínio) no limite
          do necessário.
        </li>
      </ul>
      <p>
        Quem pode vender inventário neste domínio, quando houver anúncio, está
        no <a href="/ads.txt">ads.txt</a>. Sem publisher ID válido, esse
        arquivo não autoriza o Google — de propósito.
      </p>

      <h2>5. Transferência internacional</h2>
      <p>
        A hospedagem e os produtos Google podem processar dados fora do
        Brasil (por exemplo, nos Estados Unidos). Nesses casos o tratamento
        se apoia nas salvaguardas dos próprios provedores e, para
        estatística e publicidade, no seu consentimento.
      </p>

      <h2>6. Quanto tempo guardamos</h2>
      <ul>
        <li>Logs de servidor: o prazo padrão da hospedagem (em geral, semanas).</li>
        <li>
          E-mails que você manda: enquanto a conversa fizer sentido, mais o
          prazo prescricional se houver disputa.
        </li>
        <li>
          Preferências no aparelho: até você limpar o armazenamento do
          navegador.
        </li>
        <li>
          Dados de Analytics e de anúncio: conforme as políticas e a
          retenção da propriedade no Google.
        </li>
      </ul>

      <h2>7. Seus direitos (LGPD, art. 18)</h2>
      <p>Você pode pedir:</p>
      <ul>
        <li>confirmação de que tratamos dados e acesso ao que for seu;</li>
        <li>correção;</li>
        <li>anonimização, bloqueio ou eliminação do que for desnecessário;</li>
        <li>portabilidade, quando couber;</li>
        <li>informação sobre compartilhamentos;</li>
        <li>informação sobre a possibilidade de não consentir e as consequências;</li>
        <li>revogação do consentimento;</li>
        <li>oposição a tratamento que caiba oposição.</li>
      </ul>
      <p>
        Para exercer:{" "}
        <a href={`mailto:${site.email}?subject=LGPD`}>
          {site.email}
        </a>
        , assunto “LGPD”. Respondemos no prazo legal. Também cabe reclamação
        à Autoridade Nacional de Proteção de Dados (ANPD).
      </p>

      <h2>8. Crianças e adolescentes</h2>
      <p>
        O The Zero é um newsroom de tecnologia para público geral, não um
        serviço dirigido a crianças. Não pedimos dado de menor de propósito.
        Se um responsável achar que um menor nos enviou dado pessoal, escreva
        para o e-mail acima.
      </p>

      <h2>9. Segurança</h2>
      <p>
        O domínio usa HTTPS (certificado da Vercel). Acesso ao repositório e
        ao painel de deploy fica restrito a quem publica o site. Nenhum
        sistema é infalível; se houver incidente relevante, comunicamos
        conforme a LGPD.
      </p>

      <h2>10. Mudanças</h2>
      <p>
        Se a gente passar a coletar coisa nova (newsletter, comentário),
        esta política e a data no topo mudam. Consentimento de estatística
        e publicidade a gente pede de novo se a finalidade mudar de verdade.
      </p>

      <h2>11. Contato</h2>
      <p>
        The Zero — {site.domain}.{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.{" "}
        <Link href="/contato">Página de contato</Link>.{" "}
        <Link href="/termos">Termos de uso</Link>.
      </p>
    </LegalDocument>
  );
}
