# Cyberdeception Atlas corpus protocol

**Protocol version:** 1.1
**Baseline release:** `v2026.09`  
**Effective date:** 26 September 2026 (prospective amendment; v1.0 effective 18 September 2026)

## 1. Purpose and study design

The Atlas supports a transparent scoping map of public defensive cyber-deception resources and a design-science evaluation of its evidence architecture. It connects academic papers, open software, products, services, datasets, frameworks, field reports, and community resources while preserving the source and the depth at which each source was reviewed.

The baseline release is **not a completed systematic review**. Early collection occurred through multiple editorial tranches, and the project did not retain a complete candidate and exclusion ledger for every tranche. The release is therefore described as a versioned curated corpus. This protocol governs prospective updates and enables a future PRISMA-ScR-compatible study.

## 2. Research questions

- **RQ1:** What evidence types support publicly available claims about defensive cyber deception, and where are the largest evidence gaps?
- **RQ2:** Which outcome measures are reported consistently enough to support comparison across studies or deployments?
- **RQ3:** How does the apparent shape of the corpus change when records supported only by repository or publisher metadata are excluded?
- **RQ4:** Can a source-bounded reporting schema improve the completeness and auditability of deception evaluations?

The baseline analysis directly supports RQ1 and RQ3 at corpus-description level. RQ2 requires full-text outcome coding. The isolated `http-decoy-pilot-v1` provides an initial artifact-level test for RQ4: it tests whether the reporting schema captures a controlled baseline, intervention, denominators, latency, negative controls, missing measures, and safety observations. It does not validate field effectiveness.

## 3. Eligibility criteria

### Include

A record is eligible when all conditions hold:

1. It concerns defensive cyber deception, denial, adversary engagement, moving-target defense used for deception, or an explicitly labeled adjacent area.
2. A stable public primary source or authoritative publisher record is available over HTTPS.
3. The source supports a bounded description of the resource.
4. Resource identity, type, provenance, access date, and review basis can be recorded.
5. The resource adds a distinct work, implementation, dataset, service, case, or framework rather than duplicating another record.

### Exclude

- Purely offensive impersonation, fraud, misinformation, or social deception without a defensive cyber-deception contribution.
- Search-result snippets, unsourced listicles, or secondary pages when the original source is available.
- Duplicate editions or mirrors that add no distinct evidence.
- Sources whose only accessible material is insufficient to write a bounded description.
- Automated discovery candidates that have not completed the documented source-bounded review procedure in Section 7.
- Private submissions until accepted through the editorial workflow.

### Archive rather than delete

Published records are archived when the source can no longer support the description, the resource is withdrawn, or a material identity change makes the existing record misleading. The reason and date must remain in the revision history.

## 4. Information sources and search strategy

Prospective searches must record the exact query, service, execution date, language, result count, and candidate identifiers. Current discovery sources are:

- Crossref and OpenAlex metadata searches.
- Publisher and DOI landing pages.
- Public institutional sources such as MITRE, national cybersecurity agencies, and research repositories.
- Public software repositories and their documentation.
- Primary vendor product, service, and customer-story pages.
- Community suggestions submitted through the Atlas.

Queries should combine deception terms (`cyber deception`, `honeypot`, `honeynet`, `honeytoken`, `decoy credential`, `moving target defense`, `adversary engagement`) with technique, environment, evaluation, and measurement terms. Searches must include English, Spanish, and Portuguese variants where supported. The executable discovery script stores unpublished candidates privately; it never changes the public corpus.

The baseline executable discovery queries are recorded verbatim below. Crossref retrieves up to 25 works per query using `query.title`; OpenAlex retrieves up to 20 works per query using `search`. These limits make the pass reproducible as a bounded discovery aid, but they are not sufficient by themselves for an exhaustive review.

| Service  | Queries                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crossref | `cyber deception`; `honeypot cybersecurity`; `honeytoken security`; `moving target defense cybersecurity`; `engaño cibernético señuelos`; `decepção cibernética honeypot` |
| OpenAlex | `cyber deception`; `honeypot cybersecurity`; `engaño cibernético`; `decepção cibernética`                                                                                 |

## 5. Screening and deduplication

1. Store each candidate with discovery source, query, date, URL or DOI, and title.
2. Normalize DOI to lowercase and canonicalize source URLs.
3. Deduplicate first by DOI, then canonical URL, then title and organization with manual confirmation.
4. Screen title and available metadata against eligibility criteria.
5. Review the primary source at the declared depth.
6. Record one exclusion reason from the controlled vocabulary below or create a justified new value.
7. Complete the review procedure in Section 7 and retain an editorial decision. Obtain explicit author approval before publishing a new release.

Use `data/templates/screening-ledger.csv` for prospective screening. Each row represents one candidate-source encounter; deduplicated candidates retain the identifiers of every discovery route.

Controlled exclusion reasons: `out-of-scope`, `duplicate`, `no-public-primary-source`, `insufficient-source`, `not-distinct-work`, `language-unreviewable`, `awaiting-full-text`, `other-documented`.

## 6. Baseline corpus flow

The only defensible retrospective flow for `v2026.09` is:

| Stage                                               |               Count | Evidence                                                   |
| --------------------------------------------------- | ------------------: | ---------------------------------------------------------- |
| Published public records included in frozen release |                 187 | Reproducible from `catalog.json`                           |
| Records with full-text review                       |                  20 | Reproducible from `review_basis`                           |
| Records with a source-bounded critical reading      |                  50 | Reproducible from embedded critical-reading notes          |
| Historical candidates identified                    | Not reconstructable | Candidate ledgers were not retained for all early tranches |
| Historical duplicates and exclusions                | Not reconstructable | Exclusion reasons were not recorded consistently           |

The 102 DOI candidates mentioned in operating documentation are a private discovery batch, not part of the frozen public corpus and not counted as screened or excluded. A PRISMA flow will begin with the first prospective update governed by this protocol.

## 7. Reviewer procedure and agreement

Prospective releases may use an AI-only review workflow. Human evaluation is optional; author accountability and explicit approval for publication remain required. This amendment does not change the historical single-reviewer provenance of `v2026.09.2` or add retrospective review results.

1. Freeze each claim, source version, extracted text, prompt, schema, eligibility rules, and hashes before sending that review batch. Record access restrictions and exclude unavailable or unresolved source editions from verified labels.
2. Obtain initial readings from at least two distinct provider families in fresh contexts, with identical source-bounded inputs. A third family is preferred for manuscript review. Readers must not receive other readers' answers, previous triage, or proposed corrections during initial assessment. Record the exact API model identifier when available; for web sessions record the visible model/mode label and state that the underlying version and account memory cannot necessarily be controlled.
3. Require supported/contradicted/not-located judgments with exact quotations and source locators. Deterministic checks validate input hashes, output structure, quotation containment, and completeness of cited sentences or table rows. Those checks cannot validate semantic entailment.
4. A separate adjudication pass receives the original source and all retained initial responses. It explains each agreement or disagreement using the source. Prefer another provider family; if the adjudicator shares a reader's provider, disclose that dependence. Never resolve uncertainty by vote alone. Version mismatch, missing evidence, failed checks, and unresolved entailment remain in an unresolved queue.
5. Retain raw attempts, failures, retries, initial judgments, adjudication, and final edit provenance. Correct bilingual fields together in a new local version; publish only with explicit author approval. Preserve the historical release unchanged.

Report coverage, failed requests, quote-valid outputs, agreement, disagreement, accepted candidate corrections, and unresolved items with explicit denominators. Fields within one record and repeated model outputs are dependent. If categorical agreement is reported, identify the models and fields and include raw counts; kappa, when appropriate, describes AI agreement rather than correctness or human reliability. Shared training, model drift, source extraction failures, account personalization, and common biases limit independence. No catalog error rate, accuracy, precision, or recall is claimed without a separately justified reference standard. Synthetic fact-oracle benchmarks remain separate from historical source review.

No inter-rater reliability result exists for `v2026.09`; it must not be invented retroactively. Manuscript-only AI reviews evaluate the supplied text and cannot certify repository reproduction. Subsequent artifact review and meta-review must be labeled as separate stages.

## 8. Analysis plan

The reproducible baseline analysis reports:

- Resource type, review basis, evidence label, year, source host, technique, and environment counts.
- Missingness for year, source language, paper DOI, and product/service organization country.
- Sensitivity views limited to full-text records, critical readings, source-page/full-text records, records excluding repository metadata, and non-GitHub sources.
- Counts and denominators together; multi-valued tag counts are explicitly nonexclusive.

Future outcome analysis will code sample size, setting, baseline, scenario count, alert coverage, alert latency, investigable-alert criteria, unwanted triggers, operating load, decoy recognition, safety incidents, negative results, and artifact availability.

The first worked evaluation is stored under `experiments/http-decoy-pilot-v1/`. It uses an uninstrumented local HTTP application as baseline and exact instrumented decoy routes as intervention. Its scope is deliberately limited to the reporting and event-capture pipeline.

## 9. Versioning and reproducibility

Run:

```text
npm run research:reproduce
```

Run `npm run research:reproduce -- <version> <YYYY-MM-DD>`. This creates a canonical public snapshot, checksums, analysis tables, figures, and a generated report under the explicit version directory. Generated files exclude private submissions, revisions, monitoring events, authentication data, and unpublished candidates. Commands abort when the target already exists. A release is immutable after publication; corrections require a new version.

### Corrective release policy

`v2026.09` remains the historical baseline. `v2026.09.2` reconciles the active summaries and limitations of records upgraded to full-text synthesis, regenerates pilot checksums after terminology corrections, and discloses that the September 2026 extraction was completed by one reviewer without retained page anchors or adjudication. The correction does not retroactively claim dual review or a quality appraisal. An unpublished local `v2026.09.1` build was superseded before publication.

## 10. Ethics and conflicts

The corpus contains public professional and research sources, not private telemetry. Operational evaluations require explicit authorization, isolation appropriate to the environment, data minimization, and a documented safety review. Vendor-authored sources remain attributed. The project owner's contributions to BUDA, DOLOS-T, Cyber Deception Playground, and associated publications are disclosed on the relevant records and must be considered during analysis.
