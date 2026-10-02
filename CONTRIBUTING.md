# Contributing to Cyberdeception Atlas

Cyberdeception Atlas accepts source-backed corrections, new records, paper reviews, software updates, translations, evaluation reports and independent reproductions. Programming is optional. The project currently has an owner-run editorial workflow; external review or participation is credited only after it happens.

## Send a proposal

Use a GitHub issue template for public, nonsensitive work, or the [site form](https://cyberdeceptionatlas.org/es/contribute) for a proposal that should enter the editorial queue. Do not put credentials, live decoy locations, personal telemetry, unpublished source text or security reports in a public issue or the general form. The form currently supports a basic source-linked submission; its richer templates and individual reviewer accounts are being implemented.

For a correction, identify the record and the exact claim, propose replacement wording, link the primary source and give its access date and locator. For a new record, identify the resource kind and why it meets the [corpus protocol](docs/research/CORPUS-PROTOCOL.md). For an evaluation or reproduction, include objective, environment, versions, baseline and controls, procedure, attempts, results including failures, artifacts, safety limits and what the result does not establish. Disclose vendor, author or other relevant interests. AI-generated suggestions must be labeled and source-checked.

The editor checks scope, duplicates, source support and rights, then records a reasoned decision. Acceptance for curation does not itself publish a record. A published change needs a traceable revision and a release decision. Contributors may request public credit by name or pseudonym, or no public identification; contact details and private evidence stay outside public exports. The present system does not yet implement all of this credit and decision metadata, so do not send private details expecting those options to be automated.

## Change code or documents

Open an issue describing the intended change, then a focused pull request linked to it. Preserve frozen releases and original manuscript exports; create a new version for corrections. Run the applicable commands in `package.json` and report the exact outcome. A passing check establishes software behavior within its fixtures, not independent source review or field effectiveness. Code is MIT licensed; original data and documentation use CC BY 4.0, with third-party exclusions in [LICENSE-DATA.md](LICENSE-DATA.md).

See [GOVERNANCE.md](GOVERNANCE.md) for decisions and credit, [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for participation, and [SECURITY.md](SECURITY.md) before reporting a vulnerability.
