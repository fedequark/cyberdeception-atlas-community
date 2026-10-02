# Cyberdeception Atlas research release 2026.09

This release contains the frozen public corpus, relationships, checksums, reproducible analysis, research protocol, codebook, and the first worked evaluation of the reporting schema.

## Cite

> Federico Pacheco, _Cyberdeception Atlas: Source-Bounded Corpus and Evidence Architecture_, version 2026.09, 2026. <https://cyberdeceptionatlas.org>.

No DOI has been assigned. Use the version and URL above until an archival deposit is published.

## Contents

- `catalog.json`: 187 canonicalized public records, including public critical-reading notes.
- `relationships.json`: 69 public relationships among records.
- `manifest.json`: corpus counts and source-file checksums.
- `analysis/`: generated report, structured summary, CSV tables, and SVG figures.
- `release-manifest.json`: checksums for the complete deposition payload.

The distribution archive additionally includes the corpus protocol, codebook, experiment protocol and results, licenses, citation metadata, changelog, and Zenodo metadata.

## Reproduce

From the repository root:

```text
npm ci
npm run research:reproduce
npm run experiment:http-decoy
npm run research:package
```

Corpus and analysis outputs are deterministic. Experimental timestamps and measured latencies vary by execution, so rerunning the experiment produces a new result manifest.

## Licenses

Original data and documentation: CC BY 4.0. Software: MIT. Linked third-party works retain their own rights and licenses. See `LICENSE-DATA.md` and `LICENSE`.
