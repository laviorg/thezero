"""Reels do Short da matéria: MP4 como asset da release `social-reels`.

Os vídeos ficam fora do histórico git: uma release única (tag `social-reels`,
marcada como prerelease para não poluir a página de releases) acumula um
<slug>.mp4 por matéria. O Instagram baixa pela URL pública
github.com/<repo>/releases/download/social-reels/<slug>.mp4 (302 -> CDN).
Rotacionar é apagar assets velhos pela UI ou API, sem reescrever histórico.
Quem produz o Short sobe o MP4 com scripts/social/upload_reel.py e dispara o
workflow social-post com o slug; o run.py publica o Reels quando encontra o
arquivo. Sem arquivo, nada acontece e a rotina de imagem não muda.
"""

from __future__ import annotations

from pathlib import Path

import requests

from redact import redact

REELS_TAG = "social-reels"
REELS_RELEASE_NAME = "Reels (vídeos dos Shorts)"
REELS_RELEASE_BODY = (
    "Assets de vídeo dos Shorts publicados como Reels pelo workflow social-post. "
    "Não editar à mão; upload via scripts/social/upload_reel.py. "
    "Assets antigos podem ser apagados sem afetar os Reels já publicados."
)
MAX_REEL_BYTES = 100 * 1024 * 1024  # folga sob o limite oficial de 2 GiB por asset
MAX_RELEASE_ASSETS = 1000  # limite oficial por release (docs.github.com)
API = "https://api.github.com"
UPLOADS = "https://uploads.github.com"


def reel_raw_url(repo: str, filename: str) -> str:
    return f"https://github.com/{repo}/releases/download/{REELS_TAG}/{filename}"


def is_mp4(path: Path) -> bool:
    try:
        with open(path, "rb") as handle:
            header = handle.read(12)
    except OSError:
        return False
    return len(header) >= 12 and header[4:8] == b"ftyp"


def check_reel_file(path: Path) -> None:
    if not path.is_file():
        raise RuntimeError(f"vídeo não encontrado: {path}")
    size = path.stat().st_size
    if size > MAX_REEL_BYTES:
        raise RuntimeError(f"vídeo passa de 100 MB ({size} bytes); comprima antes de subir.")
    if not is_mp4(path):
        raise RuntimeError(f"{path} não parece MP4 (cabeçalho ftyp ausente).")


def reel_asset_exists(url: str, secrets: list[str], head=None) -> bool:
    """True se o MP4 já responde 200 (seguindo o redirect da release)."""
    head = head or requests.head
    try:
        response = head(
            url,
            timeout=25,
            allow_redirects=True,
            headers={"User-Agent": "TheZeroSocial/1.0"},
        )
    except requests.RequestException as exc:
        print(redact(f"falha ao checar {url}: {exc}", secrets), flush=True)
        return False
    return response.status_code == 200


def _api(method: str, url: str, token: str, secrets: list[str], **kwargs):
    headers = kwargs.pop("headers", {})
    headers.update(
        {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
    )
    try:
        response = requests.request(method, url, timeout=60, headers=headers, **kwargs)
    except requests.RequestException as exc:
        raise RuntimeError(redact(f"falha de rede na API do GitHub: {exc}", secrets)) from None
    if response.status_code >= 400:
        detail = redact(response.text[:300], secrets)
        raise RuntimeError(f"API do GitHub devolveu HTTP {response.status_code}: {detail}")
    return response


def ensure_release(repo: str, token: str, secrets: list[str]) -> int:
    """Id da release social-reels, criando-a (prerelease) se não existir."""
    probe = requests.get(
        f"{API}/repos/{repo}/releases/tags/{REELS_TAG}",
        timeout=30,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    if probe.status_code == 200:
        return probe.json()["id"]
    if probe.status_code != 404:
        detail = redact(probe.text[:300], secrets)
        raise RuntimeError(f"não consegui ler a release {REELS_TAG}: HTTP {probe.status_code}: {detail}")
    created = _api(
        "POST",
        f"{API}/repos/{repo}/releases",
        token,
        secrets,
        json={
            "tag_name": REELS_TAG,
            "target_commitish": "main",
            "name": REELS_RELEASE_NAME,
            "body": REELS_RELEASE_BODY,
            "draft": False,
            "prerelease": True,
        },
    )
    return created.json()["id"]


def delete_asset_if_exists(repo: str, release_id: int, name: str, token: str, secrets: list[str]) -> None:
    data = _api("GET", f"{API}/repos/{repo}/releases/{release_id}/assets?per_page=100", token, secrets).json()
    for asset in data:
        if asset.get("name") == name:
            _api("DELETE", f"{API}/repos/{repo}/releases/assets/{asset['id']}", token, secrets)
            return


def upload_asset(repo: str, release_id: int, name: str, mp4: Path, token: str, secrets: list[str]) -> None:
    with open(mp4, "rb") as handle:
        _api(
            "POST",
            f"{UPLOADS}/repos/{repo}/releases/{release_id}/assets?name={name}",
            token,
            secrets,
            headers={"Content-Type": "application/octet-stream"},
            data=handle,
        )


def list_release_assets(repo: str, release_id: int, token: str, secrets: list[str]) -> list[dict]:
    assets: list[dict] = []
    for page in range(1, 11):  # 10 páginas x 100 = teto oficial de 1000 assets
        data = _api(
            "GET",
            f"{API}/repos/{repo}/releases/{release_id}/assets?per_page=100&page={page}",
            token,
            secrets,
        ).json()
        if not isinstance(data, list) or not data:
            break
        assets.extend(data)
        if len(data) < 100:
            break
    return assets



def publish_reel_asset(repo: str, token: str, secrets: list[str], slug: str, mp4: Path, credits: Path | None = None) -> str:
    """Sobe <slug>.mp4 (e <slug>.credits.txt, se dado) na release social-reels.

    Devolve a URL pública do MP4.
    """
    check_reel_file(mp4)
    if token not in secrets:
        secrets.append(token)
    release_id = ensure_release(repo, token, secrets)
    name = f"{slug}.mp4"
    delete_asset_if_exists(repo, release_id, name, token, secrets)
    upload_asset(repo, release_id, name, mp4, token, secrets)
    if credits is not None:
        credits_name = f"{slug}.credits.txt"
        delete_asset_if_exists(repo, release_id, credits_name, token, secrets)
        upload_asset(repo, release_id, credits_name, credits, token, secrets)
    return reel_raw_url(repo, name)


def fetch_reel_credits(url: str, secrets: list[str], get=None) -> str | None:
    """Baixa o <slug>.credits.txt da release. None se não existir."""
    get = get or requests.get
    try:
        response = get(
            url,
            timeout=30,
            allow_redirects=True,
            headers={"User-Agent": "TheZeroSocial/1.0"},
        )
    except requests.RequestException as exc:
        print(redact(f"falha ao baixar créditos {url}: {exc}", secrets), flush=True)
        return None
    if response.status_code != 200:
        return None
    return response.text
