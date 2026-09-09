"""Load tuto/.env into os.environ if present. Already-set variables win."""

from __future__ import annotations

import os
from pathlib import Path

_ENV = Path(__file__).resolve().parents[2] / ".env"
if _ENV.is_file():
    for _line in _ENV.read_text(encoding="utf-8").splitlines():
        _line = _line.strip()
        if not _line or _line.startswith("#") or "=" not in _line:
            continue
        _k, _, _v = _line.partition("=")
        _k, _v = _k.strip(), _v.strip().strip("'").strip('"')
        if _k:
            os.environ.setdefault(_k, _v)
