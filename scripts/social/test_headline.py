import unittest

from headline import headline_for_art, is_natural_headline


# Casos reais de posts recentes (hook do SOCIAL PACKAGE + title/excerpt do MDX).
CASES = [
    {
        "slug": "adobe-google-acrobat-gmail-drive-anuncio",
        "hook": "Acrobat: atalho prometido",
        "title": "Adobe promete Acrobat no Gmail e Drive; preço e data seguem sem detalhe",
        "summary": "Adobe e Google ampliam parceria. Acesso pelo Gmail e Drive ainda é futuro; preço, data no Brasil e idioma exigem checagens separadas.",
        "expected": "Adobe promete Acrobat no Gmail e Drive",
    },
    {
        "slug": "anatel-pgmc-iot-contratos-multirrede",
        "hook": "IoT: contratos até 2030",
        "title": "Anatel protege contratos de IoT até 2030, com limites para multirrede",
        "summary": "Anatel protege contratos elegíveis e limita restrições à multirrede. Não é roaming grátis nem enquadramento automático de todo equipamento.",
        "expected": "Anatel protege contratos de IoT até 2030, com limites para multirrede",
    },
    {
        "slug": "ceia-lumi-portugues-pesos-licenca",
        "hook": "Lumi: pesos não bastam",
        "title": "Ceia Lumi leva IA em português à indústria, mas licença pública ainda pede atenção",
        "summary": "Modelo da UFG adapta o Nemotron ao português. Licença pública, custo e validação ainda pedem atenção antes do uso em produção.",
        "expected": "Ceia Lumi leva IA em português à indústria",
    },
    {
        "slug": "google-tpu-8tx-8i-max-sistemas",
        "hook": "Sigilo e memória, não milagre de IA",
        "title": "Google anuncia TPU 8tx e 8i Max: sistemas focam sigilo e contexto de IA",
        "summary": "TPU 8tx e 8i Max são novos sistemas. Proteção em hardware não resolve permissões nem garante preço menor.",
        "expected": "Google anuncia TPU 8tx e 8i Max",
    },
    {
        "slug": "gired-leilao-190-localidades-limites",
        "hook": "190 locais, não rede pronta",
        "title": "Leilão lista 190 localidades para sinal móvel, mas verba não garante todas",
        "summary": "Leilão tem orçamento limitado e prioridade por população. Disputa em dezembro não é sinal já liberado; implantação está prevista para 2027.",
        "expected": "Leilão lista 190 localidades para sinal móvel",
    },
    {
        "slug": "meta-muse-spaces-paineis-personalizados",
        "hook": "Uma tela para cada plano",
        "title": "Meta lança spaces no Muse para criar painéis pessoais com apps conectados",
        "summary": "Spaces cria painéis dentro do Muse. Atualização depende de conexões e permissões.",
        "expected": "Meta lança spaces no Muse para criar painéis pessoais com apps conectados",
    },
    {
        "slug": "gemini-omni-1-2-flash-video",
        "hook": "Vídeo de IA até 15s",
        "title": "Gemini Omni 1.2 Flash amplia vídeos para 15 segundos e reduz preço em 720p",
        "summary": "Omni 1.2 Flash reduz preço em 720p. API, Vids e Gemini têm condições diferentes.",
        "expected": "Gemini Omni 1.2 Flash amplia vídeos para 15 segundos",
    },
    {
        "slug": "tridente-iii-cabos-submarinos-simulacao",
        "hook": "Cabos submarinos: treino de proteção",
        "title": "Tridente III vai simular ameaças a cabos submarinos no litoral de SP",
        "summary": "Tridente III prevê simulações em Santos e Praia Grande de 9 a 12 de novembro. Não é ataque real.",
        "expected": "Tridente III vai simular ameaças a cabos submarinos no litoral de SP",
    },
    {
        "slug": "prisma-cpqd-funttel-data-centers",
        "hook": "Plataforma prevista, não rede pronta",
        "title": "Prisma prevê R$ 46,3 milhões para integrar data centers, não uma rede pronta",
        "summary": "Prisma prevê R$ 46,3 milhões e 36 meses desde o convênio. Economia de energia e proteção são metas, não resultados medidos.",
        "expected": "Prisma prevê R$ 46,3 milhões para integrar data centers",
    },
    {
        "slug": "google-forms-gemini-analise-respostas",
        "hook": "Gemini analisa respostas",
        "title": "Google Forms ganha análise com Gemini; recurso exige respostas e plano elegível",
        "summary": "Google Forms ganha insights, com plano elegível e requisitos mínimos.",
        "expected": "Google Forms ganha análise com Gemini",
    },
]


class HeadlineTest(unittest.TestCase):
    def test_rejects_colon_fragments(self):
        self.assertFalse(is_natural_headline("Acrobat: atalho prometido"))
        self.assertFalse(is_natural_headline("IoT: contratos até 2030"))
        self.assertFalse(is_natural_headline("Lumi: pesos não bastam"))
        self.assertFalse(is_natural_headline("Cabos submarinos: treino de proteção"))

    def test_rejects_loose_noun_piles(self):
        self.assertFalse(is_natural_headline("Sigilo e memória, não milagre de IA"))
        self.assertFalse(is_natural_headline("190 locais, não rede pronta"))
        self.assertFalse(is_natural_headline("Uma tela para cada plano"))
        self.assertFalse(is_natural_headline("Vídeo de IA até 15s"))
        self.assertFalse(is_natural_headline("Plataforma prevista, não rede pronta"))
        self.assertFalse(is_natural_headline("Gemini analisa respostas"))  # frase com verbo, mas curta demais

    def test_keeps_complete_hooks(self):
        self.assertTrue(is_natural_headline("Claude Sheets estreia com limites"))
        self.assertTrue(is_natural_headline("Leia o alerta antes de atualizar"))
        self.assertTrue(is_natural_headline("SMS empresarial terá origem mais clara"))
        self.assertEqual(
            headline_for_art(
                "Claude Sheets estreia com limites",
                "Claude Sheets estreia em beta, mas ainda não substitui o Excel completo",
                "Planilha dentro do Claude permite edição conjunta.",
            ),
            "Claude Sheets estreia com limites",
        )
        self.assertEqual(
            headline_for_art(
                "Leia o alerta antes de atualizar",
                "Garmin libera beta 7.13 para Fenix 9 e Enduro 4, mas alerta para falha ao gravar escalada indoor",
                "Beta 7.13 traz mudanças para Fenix 9 e Enduro 4, mas Indoor Climb pode travar o relógio.",
            ),
            "Leia o alerta antes de atualizar",
        )
        self.assertEqual(
            headline_for_art(
                "SMS empresarial terá origem mais clara",
                "Anatel prevê cadastro público de remetentes de SMS e bloqueio de códigos irregulares",
                "Cadastro e bloqueio têm prazo. Link ainda exige cuidado.",
            ),
            "SMS empresarial terá origem mais clara",
        )

    def test_rewrites_recent_robotic_hooks(self):
        for case in CASES:
            with self.subTest(case["slug"]):
                got = headline_for_art(case["hook"], case["title"], case["summary"])
                self.assertEqual(got, case["expected"], f"{case['slug']}: {got!r}")
                self.assertTrue(is_natural_headline(got), f"{case['slug']} ainda não é frase: {got!r}")

    def test_strips_emdash_and_does_not_invent(self):
        got = headline_for_art(
            "Acordo — detalhes no ar",
            "Empresa anuncia acordo com a operadora no Brasil",
            "",
        )
        self.assertEqual(got, "Empresa anuncia acordo com a operadora no Brasil")
        self.assertNotIn("—", got)
        self.assertNotIn("–", got)

    def test_colon_after_complete_clause_keeps_the_clause(self):
        got = headline_for_art(
            "Sigilo e memória, não milagre de IA",
            "Google anuncia TPU 8tx e 8i Max: sistemas focam sigilo e contexto de IA",
        )
        self.assertEqual(got, "Google anuncia TPU 8tx e 8i Max")


if __name__ == "__main__":
    unittest.main()
