"""Verify every release member against its manifest without extracting it."""

import hashlib
import json
import sys
import tarfile
from pathlib import Path


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


version = sys.argv[1] if len(sys.argv) > 1 else ""
if not version.startswith("v") or "/" in version or "\\" in version or ".." in version:
    raise SystemExit("Usage: python scripts/verify-release-archive.py <version>")
root = Path("public/downloads/research") / version
archive = root / f"cyberdeception-atlas-{version}.tar.gz"
sidecar = (root / f"cyberdeception-atlas-{version}.tar.gz.sha256").read_text(encoding="utf-8").split()[0]
assert sha256(archive.read_bytes()) == sidecar
manifest = json.loads((root / "release-manifest.json").read_text(encoding="utf-8"))
assert manifest["version"] == version
prefix = f"cyberdeception-atlas-{version}/"
seen = set()
with tarfile.open(archive, "r:gz") as bundle:
    for member in bundle:
        assert member.isfile() and member.name.startswith(prefix)
        path = member.name[len(prefix):]
        assert path in manifest["files"] or path == f"data/releases/{version}/release-manifest.json"
        assert path not in seen
        seen.add(path)
        payload = bundle.extractfile(member).read()
        if path in manifest["files"]:
            expected = manifest["files"][path]
            assert len(payload) == expected["bytes"] and sha256(payload) == expected["sha256"], path
assert set(manifest["files"]).issubset(seen)
print(json.dumps({"version": version, "archive_sha256": sidecar, "verified_members": len(seen)}))
