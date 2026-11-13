"""Normaliza o título desenhado na arte do Instagram (feed e Story).

O hook do SOCIAL PACKAGE costuma chegar como fragmento de editoria
("Acrobat: atalho prometido", "190 locais, não rede pronta"). A arte
precisa de uma frase curta e natural em PT-BR, fiel à matéria: sujeito
e verbo, sem pilha de palavras, sem cadeia de dois-pontos e sem travessão.
"""

from __future__ import annotations

import re
import unicodedata

# Aceite da frase final (e do hook, quando ele já serve).
_MIN_WORDS = 5
_MAX_WORDS = 14
# Título/resumo podem ser cortados até este teto, preferindo 6–12.
_TARGET_MAX = 12

_EMDASH = re.compile(r"[\u2012\u2013\u2014\u2015]+")
_SPACE = re.compile(r"\s+")
_FIRST_SENTENCE = re.compile(r"(?<=[.!?…])\s+")

# Verbos frequentes em título de notícia (3ª pessoa, pretérito, futuro,
# auxiliares e alguns imperativos). "alerta" fica de fora: também é
# substantivo comum em hooks fragmentados.
_VERBS = frozenset(
    """
    é são está estão esteve estiveram será serão seria seriam seja sejam
    foi foram fica ficam ficou ficarão
    tem têm teve tiveram terá terão teria teriam ter haja
    há houve haverá
    vai vão irá irão ia iam ir
    pode podem pôde pode puderam poderá poderão
    deve devem deverá deverão
    precisa precisam precisou precisará
    começa começam começou começará começar
    continua continuam continuou
    volta voltam voltou
    faz fazem fez fizeram fará farão fazer
    dá dão deu deram dará
    diz dizem disse disseram dirá
    vê veem viu viram verá veja ver
    sai saem saiu sairão
    chega chegam chegou chegará
    passa passam passou passará
    entra entram entrou
    cai caem caiu cairá
    sobe sobem subiu subirá
    vem vêm veio virá virão
    quer querem quis
    anuncia anunciam anunciou anunciará anunciar
    lança lançam lançou lançará lançar
    promete prometem prometeu prometerá
    amplia ampliam ampliou ampliará
    estreia estreiam estreou estreará
    prevê preveem previu preverá prever preve
    simula simulam simulou simulará simular
    analisa analisam analisou
    traz trazem trouxe trará
    libera liberam liberou liberará
    testa testam testou
    corta cortam cortou
    aumenta aumentam aumentou
    confirma confirmam confirmou
    adia adiam adiou
    remove removem removeu
    compra compram comprou
    ganha ganham ganhou ganhará
    leva levam levou levará
    pede pedem pediu
    protege protegem protegeu
    limita limitam limitou
    cria criam criou criará
    abre abrem abriu abrirá
    fecha fecham fechou
    termina terminam terminou
    permite permitem permitiu
    exige exigem exigiu exigirá
    reduz reduzem reduziu reduzirá
    muda mudam mudou
    mostra mostram mostrou
    explica explicam explicou
    revela revelam revelou
    divulga divulgam divulgou
    publica publicam publicou
    atualiza atualizam atualizou
    corrige corrigem corrigiu
    bloqueia bloqueiam bloqueou
    aprova aprovam aprovou
    rejeita rejeitam rejeitou
    lista listam listou
    integra integram integrou
    conecta conectam conectou
    oferece oferecem ofereceu
    inclui incluem incluiu
    substitui substituem substituiu
    grava gravam gravou
    usa usam usou
    recebe recebem recebeu
    envia enviam enviou
    descobre descobrem descobriu
    adota adotam adotou
    firma firmam firmou
    assina assinam assinou
    renova renovam renovou
    encerra encerram encerrou
    suspende suspendem suspendeu
    proíbe proibem proibiu
    autoriza autorizam autorizou
    regulamenta regulamentam regulamentou
    disciplina disciplinam disciplinou
    define definem definiu
    escolhe escolhem escolheu
    mantém mantêm manteve
    deixa deixam deixou
    avisa avisam avisou
    amplia
    reduz
    apresenta apresentam apresentou
    detalha detalham detalhou
    estende estendem estendeu
    cobre cobrem cobriu
    atinge atingem atingiu
    supera superam superou
    registra registram registrou
    informa informam informou
    confirma
    nega negam negou
    afirma afirmam afirmou
    recusa recusam recusou
    aceita aceitam aceitou
    instala instalam instalou
    ativa ativam ativou
    desativa desativam desativou
    migra migram migrou
    troca trocam trocou
    troca
    amplia
    leia veja confira evite atualize saiba entenda
    """.split()
)

# Segunda parte de "X e Y" só conta como frase nova se Y começar com verbo.
_CONTRAST = re.compile(
    r"\s*,?\s*\b(?:mas|porém|contudo|todavia|entretanto)\b\s+",
    re.IGNORECASE,
)
_NAO_CONTRAST = re.compile(r"\s*,\s+não\s+", re.IGNORECASE)


def _fold(token: str) -> str:
    token = token.casefold().strip(".,;:!?…\"'`“”‘’()[]")
    return token


def words(text: str) -> list[str]:
    return [w for w in _SPACE.split(text.strip()) if w]


def word_count(text: str) -> int:
    return len(words(text))


def normalize_text(text: str) -> str:
    text = unicodedata.normalize("NFC", text or "")
    text = text.replace("\u00a0", " ")
    text = _EMDASH.sub(", ", text)
    text = _SPACE.sub(" ", text).strip()
    if len(text) >= 2 and text[0] == text[-1] and text[0] in {'"', "'", "“", "”"}:
        text = text[1:-1].strip()
    text = text.strip(" \t.;")
    return text


def _is_acronym(raw: str) -> bool:
    core = raw.strip(".,;:!?…\"'`“”‘’()[]")
    return bool(core) and len(core) <= 4 and core.isalpha() and core.isupper()


def has_verb(text: str) -> bool:
    # "IA" não pode contar como o verbo "ia".
    for raw in words(text):
        if _is_acronym(raw):
            continue
        tok = _fold(raw)
        if tok in _VERBS:
            return True
    return False


def _colon_is_label(text: str) -> bool:
    if ":" not in text:
        return False
    left, _right = text.split(":", 1)
    left = left.strip()
    if not left:
        return True
    # "Google anuncia TPU 8tx e 8i Max: sistemas focam..." é cláusula + detalhe.
    if has_verb(left) and word_count(left) >= 4:
        return False
    return True


def is_natural_headline(text: str) -> bool:
    """Frase completa, curta, sem rótulo de dois-pontos nem contraste sem verbo."""
    text = normalize_text(text)
    if not text:
        return False
    if _colon_is_label(text):
        return False
    if _NAO_CONTRAST.search(text) and not has_verb(_NAO_CONTRAST.split(text)[0]):
        return False
    if not has_verb(text):
        return False
    n = word_count(text)
    return _MIN_WORDS <= n <= _MAX_WORDS


def _first_clause(text: str) -> str:
    text = normalize_text(text)
    if not text:
        return ""
    if ";" in text:
        left, right = text.split(";", 1)
        left, right = left.strip(), right.strip()
        if is_natural_headline(left) or (has_verb(left) and word_count(left) >= 4):
            text = left
    if ":" in text:
        left, right = text.split(":", 1)
        left, right = left.strip(), right.strip()
        if has_verb(left) and word_count(left) >= 4:
            text = left
        elif is_natural_headline(right):
            text = right
    contrast = _CONTRAST.split(text, maxsplit=1)
    if len(contrast) == 2 and (
        is_natural_headline(contrast[0])
        or (has_verb(contrast[0]) and _MIN_WORDS <= word_count(contrast[0]) <= _MAX_WORDS)
    ):
        text = contrast[0].strip(" ,")
    nao = _NAO_CONTRAST.split(text, maxsplit=1)
    if len(nao) == 2 and (
        is_natural_headline(nao[0])
        or (has_verb(nao[0]) and _MIN_WORDS <= word_count(nao[0]) <= _MAX_WORDS)
    ):
        text = nao[0].strip(" ,")
    return normalize_text(text)


def _trim_conjunction(text: str) -> str:
    """Corta 'e + verbo' no fim quando a primeira parte já é uma frase boa."""
    text = normalize_text(text)
    if word_count(text) <= _TARGET_MAX:
        return text
    parts = re.split(r"\s+e\s+", text)
    if len(parts) < 2:
        return text
    # Reagrupa da esquerda até o último 'e' cujo lado direito começa com verbo.
    acc = parts[0]
    for part in parts[1:]:
        if has_verb(part.split(" ", 1)[0]) and is_natural_headline(acc):
            return acc
        acc = f"{acc} e {part}"
    return text


def headline_from_title(title: str) -> str:
    text = _first_clause(title)
    text = _trim_conjunction(text)
    if word_count(text) > _MAX_WORDS:
        # Último recurso: corta no último espaço até o teto, só se sobrar verbo.
        kept = words(text)[:_TARGET_MAX]
        candidate = " ".join(kept)
        if has_verb(candidate):
            text = candidate
    return normalize_text(text)


def _first_sentence(text: str) -> str:
    text = normalize_text(text)
    if not text:
        return ""
    parts = _FIRST_SENTENCE.split(text, maxsplit=1)
    return normalize_text(parts[0])


def headline_for_art(hook: str, title: str, summary: str = "") -> str:
    """Devolve a frase que deve ir na arte.

    Prefere o hook quando ele já é uma frase natural. Caso contrário,
    reescreve a partir do título da matéria e, se ainda faltar, da
    primeira frase do summary. Não inventa fato fora desses textos.
    """
    hook_n = normalize_text(hook)
    if is_natural_headline(hook_n):
        return hook_n
    title_h = headline_from_title(title)
    if is_natural_headline(title_h):
        return title_h
    summary_h = headline_from_title(_first_sentence(summary))
    if is_natural_headline(summary_h):
        return summary_h
    for candidate in (title_h, hook_n, summary_h):
        if has_verb(candidate) and word_count(candidate) >= 4:
            return candidate
    return title_h or hook_n or summary_h
