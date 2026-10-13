"""Durante a espera da matéria: se o último deploy-cloudflare falhou, dispara de novo UMA vez."""

from __future__ import annotations

import requests

from redact import redact

WORKFLOW = "deploy-cloudflare.yml"
FAILED = {"failure", "cancelled", "timed_out", "startup_failure"}


def _headers(token: str) -> dict[str, str]:
    return {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "thezero-social-post",
        "Authorization": f"Bearer {token}",
    }


def latest_runs(repo: str, token: str) -> list[dict]:
    url = f"https://api.github.com/repos/{repo}/actions/workflows/{WORKFLOW}/runs"
    response = requests.get(url, headers=_headers(token), params={"branch": "main", "per_page": 5}, timeout=30)
    if response.status_code >= 300:
        return []
    return response.json().get("workflow_runs") or []


def needs_redeploy(runs: list[dict]) -> bool:
    """True só se nada está rodando/na fila e o run mais recente terminou em falha."""
    if not runs:
        return False
    if any(r.get("status") != "completed" for r in runs):
        return False
    return runs[0].get("conclusion") in FAILED


def dispatch(repo: str, token: str) -> bool:
    url = f"https://api.github.com/repos/{repo}/actions/workflows/{WORKFLOW}/dispatches"
    response = requests.post(url, headers=_headers(token), json={"ref": "main"}, timeout=30)
    return response.status_code == 204


class DeployGuard:
    """Chamado a cada volta da espera; redispara o deploy no máximo uma vez."""

    def __init__(self, repo: str, token: str, secrets: list[str], every: int = 4):
        self.repo, self.token, self.secrets, self.every = repo, token, secrets, every
        self.ticks = 0
        self.redeployed = False

    def __call__(self) -> None:
        self.ticks += 1
        if self.redeployed or not self.token or self.ticks % self.every:
            return
        try:
            if needs_redeploy(latest_runs(self.repo, self.token)):
                ok = dispatch(self.repo, self.token)
                self.redeployed = True
                print(f"deploy-cloudflare falhou; redisparo {'ok' if ok else 'recusado'}", flush=True)
        except requests.RequestException as exc:
            print(redact(f"checagem do deploy falhou: {exc}", [*self.secrets, self.token]), flush=True)
