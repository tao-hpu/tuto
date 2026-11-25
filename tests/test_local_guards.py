"""Offline checks for the Ruff fixes and the security floors.

No network, no model calls. Run:
    uv run --extra api python tests/test_local_guards.py
"""

from __future__ import annotations

import gzip
import io
import tarfile
import time
from importlib import metadata

import certifi
from cryptography import x509
from opentelemetry import trace
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator

from tuto.fulltext.fetch import _concat_tex
from tuto.l2.llm_client import LLMClient

REMOVED_EMSIGN = (
    "emSign ECC Root CA - G3",
    "emSign Root CA - C1",
    "emSign ECC Root CA - C3",
)
KEPT_EMSIGN = "emSign Root CA - G1"


def _names() -> list[str]:
    with open(certifi.where(), "rb") as handle:
        pem = handle.read()
    names = []
    for block in pem.split(b"-----END CERTIFICATE-----"):
        block = block.strip()
        if b"BEGIN CERTIFICATE" not in block:
            continue
        cert = x509.load_pem_x509_certificate(block + b"\n-----END CERTIFICATE-----\n")
        names.append(cert.subject.rfc4514_string())
    return names


def check_certifi() -> None:
    version = certifi.__version__
    assert tuple(int(p) for p in version.split(".")) >= (2026, 10, 23), version
    names = _names()
    for cn in REMOVED_EMSIGN:
        assert not any(cn in name for name in names), cn
    assert any(KEPT_EMSIGN in name for name in names)


def check_otel() -> None:
    version = metadata.version("opentelemetry-api")
    assert tuple(int(p) for p in version.split(".")) >= (1, 45, 2), version
    prop = TraceContextTextMapPropagator()
    valid = "00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01"
    ctx = prop.extract({"traceparent": valid})
    span = trace.get_current_span(ctx)
    assert span.get_span_context().is_valid
    started = time.perf_counter()
    rejected = prop.extract({"traceparent": "00-" + ("a" * 600)})
    elapsed = time.perf_counter() - started
    assert elapsed < 0.05, elapsed
    assert not trace.get_current_span(rejected).get_span_context().is_valid


def check_tex() -> None:
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w") as tf:
        payload = b"\\section{A}\nhello\n"
        info = tarfile.TarInfo("paper.tex")
        info.size = len(payload)
        tf.addfile(info, io.BytesIO(payload))
    got = _concat_tex(buf.getvalue())
    assert got is not None and "hello" in got

    gz = gzip.compress(b"\\title{T}\nbody\n")
    got = _concat_tex(gz)
    assert got is not None and "body" in got
    assert _concat_tex(b"not an archive") is None


class _Resp:
    status_code = 200

    def __init__(self, content: str):
        self._content = content

    def raise_for_status(self) -> None:
        return None

    def json(self) -> dict:
        return {"choices": [{"message": {"content": self._content}}]}


class _Client:
    def __init__(self, content: str):
        self.content = content
        self.calls = 0

    def post(self, url: str, json: dict) -> _Resp:
        self.calls += 1
        return _Resp(self.content)


def check_non_object_json() -> None:
    import os

    os.environ.setdefault("LLM_BASE_URL", "http://127.0.0.1:9")
    os.environ.setdefault("LLM_API_KEY", "local-test-not-a-secret")
    client = LLMClient(model="local-test")
    fake = _Client("[1, 2]")
    client.client = fake
    assert client.judge_json("s", "u") is None
    assert fake.calls == 4

    class Boom:
        def post(self, url: str, json: dict):
            raise TypeError("transport bug")

    client.client = Boom()
    try:
        client.judge_json("s", "u")
    except TypeError as exc:
        assert exc.args == ("transport bug",)
    else:
        raise AssertionError("unrelated TypeError was swallowed")


def main() -> None:
    from tuto.l2 import llm_client

    llm_client.time.sleep = lambda _seconds: None
    check_certifi()
    check_otel()
    check_tex()
    check_non_object_json()
    print("PASS local guards")


if __name__ == "__main__":
    main()
