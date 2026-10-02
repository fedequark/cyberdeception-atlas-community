# Cyberdeception Atlas

Cyberdeception Atlas is a bilingual, source-linked reference for defensive cyber deception. This clean public source mirror accepts proposals and code changes. The operational Git history, D1 backups, unpublished submissions and private research material remain in a separate private repository. D1 is the published catalog; GitHub issues and pull requests are proposal channels.

The historical frozen corpus `v2026.09.2` has 187 records, 20 single-reviewer full-text syntheses and 50 source-bounded reading notes. The newer `v2026.10` package contains 190 records and 24 full-text readings; consult the release metadata and the [live export](https://cyberdeceptionatlas.org/api/export?format=json) to distinguish a prepared package from a deployed database version. Neither corpus is a systematic review, census or measure of defensive effectiveness.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change, [GOVERNANCE.md](GOVERNANCE.md) for the current decision path and [SECURITY.md](SECURITY.md) before reporting sensitive findings. A source-backed correction, review, translation, evaluation or reproduction does not require programming. No external collaborator or independent reviewer is claimed until actual participation is recorded.

Code is MIT licensed. Original catalog descriptions, protocols and documentation use CC BY 4.0; linked third-party sources retain their own rights. The [corpus protocol](docs/research/CORPUS-PROTOCOL.md), [codebook](docs/research/CODEBOOK.md), [published preprint](public/downloads/research/preprint-v2026.09.2/cyberdeception-atlas-preprint-v2026.09.2.en.pdf) and [release manifests](data/releases/) state the evidence and reproduction limits. A new collaborative manuscript draft is being reviewed privately with its actual authors before any public release. Frozen releases are preserved.

For local development, use Node.js 22.12 or newer, `npm ci`, `npm run catalog:validate`, `npm test`, `npm run check` and `npm run build`. A passing build does not certify source claims or community uptake. The public mirror is not configured to deploy production or back up D1.
