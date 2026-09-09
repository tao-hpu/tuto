"""Thin OpenAI-compatible chat client for the L2 support judge.

Kept minimal and dependency-free (httpx only, like the Cito backend). Endpoint and key
come from LLM_BASE_URL / LLM_API_KEY. There is no silent model default: a missing
L2_MODEL made one audited run unattributable. Request shape is model-dependent:
Claude and official GPT-5 / o-series reject a custom `temperature`; GPT-5 / o-series
also reject `max_tokens` (they take `max_completion_tokens`).
"""

from __future__ import annotations

import json
import os
import re
import time

import httpx


def _openai_new_chat_model(model: str) -> bool:
    """Official GPT-5 / o-series: no custom temperature, `max_completion_tokens` only."""
    return model.startswith("gpt-5") or bool(re.match(r"^o[1-4](\b|-)", model))


class LLMClient:
    def __init__(self, model: str | None = None, timeout: float = 60.0):
        self.base = os.environ.get("LLM_BASE_URL", "").rstrip("/")
        self.key = os.environ.get("LLM_API_KEY", "")
        # No silent default. The audited run of this pipeline took its judge from
        # L2_MODEL with a default nobody noticed, recorded the model nowhere, and
        # the result was a headline number that could not later be attributed to
        # a judge or cleared of it. Failing loudly here is cheaper than that.
        self.model = model or os.environ.get("L2_MODEL") or ""
        if not self.model:
            raise ValueError(
                "no model: pass model= or set L2_MODEL. This used to default to "
                "gpt-4o-mini silently, which made one run's judge unrecoverable."
            )
        if not self.base or not self.key:
            raise ValueError("LLM_BASE_URL / LLM_API_KEY not set")
        self.client = httpx.Client(
            headers={"Authorization": f"Bearer {self.key}"}, timeout=timeout
        )

    def judge_json(self, system: str, user: str, max_tokens: int = 400) -> dict | None:
        """Return the model's JSON object, or None on unrecoverable failure.

        max_tokens must cover REASONING too: Claude and GPT-5 think inside the same
        budget, and a 400-token cap can be fully consumed by reasoning, returning an empty
        content (observed with claude-sonnet-5: 8 of 13 arbiter calls came back blank).
        Callers using a reasoning model should pass a few thousand. gpt-5.6 is sent
        reasoning_effort=none so the default 400-token judge calls stay usable.
        """
        new_chat = _openai_new_chat_model(self.model)
        body: dict = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "response_format": {"type": "json_object"},
        }
        if new_chat:
            body["max_completion_tokens"] = max_tokens
        else:
            body["max_tokens"] = max_tokens
        if not self.model.startswith("claude") and not new_chat:
            body["temperature"] = 0
        if self.model.startswith("gpt-5.6"):
            body["reasoning_effort"] = "none"
        for attempt in range(4):
            try:
                r = self.client.post(f"{self.base}/chat/completions", json=body)
                if r.status_code in (429, 500, 502, 503):
                    time.sleep(2**attempt)
                    continue
                r.raise_for_status()
                content = r.json()["choices"][0]["message"]["content"] or ""
                content = content.strip()
                if content.startswith("```"):  # some models fence JSON despite response_format
                    content = content.strip("`").removeprefix("json").strip()
                data = json.loads(content)
                if isinstance(data, list):  # some models wrap the object in an array
                    data = next((x for x in data if isinstance(x, dict)), None)
                if not isinstance(data, dict):
                    raise ValueError("model returned non-object JSON")
                return data
            except (httpx.HTTPError, KeyError, json.JSONDecodeError, ValueError):
                if attempt == 3:
                    return None
                time.sleep(2**attempt)
        return None

    def close(self) -> None:
        self.client.close()
