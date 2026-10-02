# Cyberdeception Atlas: A Source-Bounded Evidence Map and Reporting Framework

**Federico Pacheco and Diego Staino**
**Manuscript status:** preprint candidate; not peer reviewed or submitted  
**Artifact version:** v2026.09.2
**Research record date:** 23 September 2026

## Abstract

Cyber-deception literature and practice combine heterogeneous evidence: product pages, software repositories, bibliographic metadata, full publications, customer accounts, and controlled experiments. Treating these sources as interchangeable can turn evidence of existence into an unsupported claim of defensive effectiveness. This paper presents Cyberdeception Atlas, a bilingual, source-linked evidence map and reporting architecture. The corrective artifact release contains 187 public records classified by source and review depth, 50 source-bounded critical-reading notes, and 20 single-reviewer full-text syntheses. A reproducible sensitivity analysis reduces the visible corpus from 187 to 88 records when repository-metadata records are excluded, demonstrating that corpus volume and evidentiary depth answer different questions. A deterministic loopback conformance test records 160 requests and shows that the reporting schema can serialize baselines, denominators, negative controls, latency, missing measures, and safety observations. It does not evaluate adversaries or production effectiveness. Two four-model extraction pilots document a review workflow and its human adjudication burden, but provide no accuracy or time-saving estimate. The contribution is methodological and infrastructural: explicit separation of claims, sources, review depth, and outcome evidence, together with a corrective release and a prospective protocol for independent schema evaluation. The legacy corpus lacks a complete historical screening ledger, dual review, page-level extraction anchors, and comparable outcome coding; it is a curated evidence map rather than an exhaustive systematic review.

**Index Terms—** cyber deception, honeypots, honeytokens, evidence mapping, security measurement, reproducibility, reporting schema.

## I. Introduction

Cyber deception encompasses honeypots, honeytokens, decoy assets, moving-target mechanisms, and adversary-engagement techniques. The field spans formal models, laboratory prototypes, open-source software, commercial systems, and operational programs. This breadth creates a measurement problem: a repository demonstrates that software exists; a vendor page documents a claimed capability; a paper can report a study under bounded conditions; and a field evaluation can expose operational effects. None is a substitute for the others.

Cyberdeception Atlas addresses this problem by recording what source was examined and what that source can support. It does not rank products from marketing claims or infer effectiveness from project activity. Instead, it treats provenance, review depth, missingness, and denominators as first-class data. The artifact is intended to help researchers and security teams ask a narrower question before comparing results: what kind of evidence supports each statement?

This paper makes four bounded contributions:

1. a source-bounded data model separating resource type, evidence label, review basis, and outcome evidence;
2. an immutable, versioned 187-record evidence-map release with executable descriptive and sensitivity analyses;
3. a minimum reporting schema for cyber-deception evaluations, including negative and non-measured outcomes; and
4. a reproducible conformance test plus a prospective independent-evaluation protocol.

The paper does not claim exhaustive field coverage, product superiority, or risk reduction.

## II. Background and Related Work

Prior surveys organize cyber deception by mechanism, system layer, game structure, or research trend. Lu et al. synthesize strategic and technical deception across networks and computing systems [1]. Pawlick et al. provide a game-theoretic taxonomy covering multiple deception classes [2]. Beltrán López et al. review recent techniques, frameworks, artificial-intelligence approaches, technology readiness, and open challenges [3]. These works establish the heterogeneity of the field but do not provide a continuously versioned, mixed-source evidence map that exposes source depth on every public record.

Operational guidance introduces a different evidence class. The UK National Cyber Security Centre reported lessons from a program involving multiple organizations, providers, and product trials, emphasizing terminology, outcome measurement, impartial guidance, and configuration risks [4]. Vendor-published case studies can illuminate deployment questions, but their provenance and conflicts must remain visible.

Reporting quality is therefore part of the research problem. Alert counts without attempted-scenario denominators, benign controls, baseline conditions, analyst effort, or negative outcomes cannot establish improvement. The Atlas architecture focuses on preserving these boundaries rather than synthesizing unlike outcomes into a single effectiveness score.

## III. Research Questions

The current artifact addresses the following questions at different maturity levels:

- **RQ1:** What evidence types and reporting gaps characterize the curated Atlas corpus?
- **RQ2:** Which outcome variables are reported by the full-text subset, and how comparable are they?
- **RQ3:** How sensitive are corpus-level observations to source and review-depth exclusions?
- **RQ4:** Can the reporting schema represent a bounded experiment, and does it improve reporting completeness for independent reviewers?

The current release answers RQ1 descriptively and RQ3 through executable sensitivity views. It answers only the representation component of RQ4. RQ2 and the comparative component of RQ4 require prospective data and are not reported as completed results.

## IV. Corpus and Evidence Architecture

### A. Corpus scope

The baseline was assembled through several editorial tranches from public sources. Because a complete retrospective candidate and exclusion ledger was not retained, the artifact is a curated evidence map, not a completed systematic or scoping review. The prospective protocol records exact discovery queries, bounded Crossref and OpenAlex retrieval, controlled eligibility and exclusion reasons, deduplication, and a future second-reviewer procedure.

### B. Evidence representation

Every record separates resource kind from review basis. Resource kinds include paper, software, product, service, case study, dataset, framework, and community resource. Review basis records the material actually examined: public source page, repository metadata/documentation, publisher metadata, abstract, or full text. Review depth is descriptive; it is neither a quality grade nor an effectiveness score.

Full-text records additionally contain design, finding, limitations, extraction status, adjudication status, and page-anchor fields. For the September 2026 syntheses, one reviewer completed the synthesis; page anchors and independent adjudication were not retained. The corrective release discloses these missing properties rather than reconstructing them retrospectively.

### C. Version and correction model

Release v2026.09 is retained as the historical artifact. Corrective release v2026.09.2 reconciles active summaries and limitations for records upgraded to full-text synthesis, exposes extraction-provenance limitations, and contains regenerated pilot checksums after the terminology correction. Release commands require explicit version and date arguments and abort if a target exists. The manifest records source commit, schema version, correction predecessor, file sizes, and SHA-256 hashes.

## V. Reproducible Corpus Analysis

The canonical catalog contains 187 records. The review-basis distribution is 99 repository-metadata records, 45 source-page records, 22 publisher-metadata records, 20 full-text syntheses, and one abstract record. Fifty records carry a source-bounded critical-reading note.

The primary sensitivity result is descriptive: removing repository-metadata records reduces the analytic view from 187 to 88. Restricting the corpus to full-text syntheses leaves 20 records. These changes do not form an evidence-quality scale; they show that the apparent size and composition of the collection depend on what material was examined.

Missingness is also material. The baseline contains 43 records without publication year, 124 without recorded source language, and incomplete bibliographic and organization metadata. Unknown values remain unknown; they are not converted to negative observations. Technique and environment tags are multivalued and therefore do not sum to the corpus total.

The analysis does not estimate prevalence in the worldwide field. Discovery caps, public-source availability, historical selection, language constraints, and the large software component make such inference invalid.

## VI. Minimum Evaluation Schema

The reporting schema records objective, environment, technique, system or decoy version, baseline, condition, authorized scenario, expected signal, attempted-scenario denominator, missed signals, unwanted triggers, time to alert, investigability criteria, human operating effort, decoy recognition, safety incidents, negative results, observer, and provenance.

Three rules constrain interpretation. First, every ratio retains numerator and denominator. Second, unknown or unmeasured values remain null and are never translated to zero. Third, vendor-declared capability, demonstration observation, first-party test result, and independent published result remain distinct.

## VII. Conformance Test

The `http-decoy-pilot-v1` artifact compares an uninstrumented local HTTP application with the same application plus four exact instrumented routes. Four benign or near-match routes act as negative controls. Each route is requested ten times in each condition, yielding 80 baseline and 80 intervention observations.

The intervention emits 40 of 40 expected schema-complete events and zero events for 40 benign controls. The baseline emits no events, including for 40 requests directed at names used as decoy routes in the intervention. All raw observations, event records, generated summaries, and checksums are retained.

These results are structurally determined by exact pathname matching and condition-specific instrumentation. Repetitions verify stable execution but are not independent attack samples. The baseline cannot emit the intervention event by design. The result therefore establishes only that the implementation serializes the protocol-defined fields and negative controls under isolated loopback conditions. It does not establish realism, analyst usefulness, production latency, attacker behavior, or risk reduction.

## VIII. Prospective Independent Evaluation

The planned `reporting-schema-study-v1` uses a randomized, counterbalanced crossover design. Between six and twelve practitioners or researchers will report matched synthetic scenarios using both free-form and Atlas templates. Blinded evaluators will score recovery of 12 required evidence elements, unsupported inference, contradiction, completion time, confidence, and usability. The participant—not each rubric field—is the experimental unit. A second evaluator will independently score at least 20% of reports.

No participants have been enrolled and no comparative results are claimed. Ethics or institutional review requirements must be resolved before recruitment. The prospective protocol, rubric, empty data template, and analysis script are prepared in the project workspace; they are not part of the public v2026.09.2 archive.

## IX. Four-Model Extraction Feasibility Pilots

An ancillary source-first workflow used OpenAI, Claude, Gemini, and DeepSeek to extract 18 typed and 13 narrative fields from each of two selected papers. Frozen prompts and comparison rules preceded the calls. The first paper produced four structurally valid outputs on first attempt and a human queue of 16 of 18 typed fields. The second required one retained DeepSeek invalid-JSON retry and queued 10 of 18 typed fields. The queues included model disagreements, evidence issues, and sampled unanimous-field controls. All queued items received a human decision, but most decisions were assistant-guided after the source-first sampled checks. The 13 narrative fields per paper received separate assistant source review. The reviewer self-reported five active minutes for each initial review, excluding waiting and later work. No manual comparator, representative paper sample, independent gold standard, or two-human reliability estimate exists. These pilots therefore document workflow behavior and failure modes, not extraction accuracy, review-time reduction, or validation of the 187-record legacy corpus. Their canonical adjudications and provider outputs remain private and are not part of the public corrective release.

## X. Threats to Validity

**Construct validity:** Review basis measures material examined, not study quality. “Investigable” in the pilot is a legacy field name for schema completeness and does not represent analyst judgment.

**Internal validity:** The corpus baseline was curated before the prospective protocol. Full-text syntheses lack retained page anchors and independent adjudication. The conformance test is written against its own exact routes and can pass without demonstrating security benefit.

**External validity:** Public sources omit confidential procurement data, negative operational outcomes, and internal telemetry. Software-repository concentration reflects curation and source availability. Results cannot be generalized to the global market or production environments.

**Statistical conclusion validity:** Corpus counts are descriptive. The pilot repetitions are not independent units and no significance test is appropriate. The planned human study is small and will require paired, participant-level reporting with uncertainty.

**AI extraction validity:** The two selected papers, assistant-guided adjudication, sampled source-first checks, and self-reported active minutes cannot support model rankings, extraction error rates, or time-saving claims. The private records must not be confused with a public, independently validated corpus.

**Researcher positionality:** Both authors coauthored BUDA, DOLOS-T, and Cyber Deception Playground. Those relationships are disclosed; these projects and the Atlas's own pilot are not treated as independent effectiveness evidence.

## XI. Discussion

The artifact demonstrates a practical distinction between evidence volume and evidentiary depth. Its strongest current contribution is not a new effectiveness estimate but an inspectable boundary around what a heterogeneous source collection can support. The correction process illustrates why that boundary must be enforced technically: changing a review label without replacing inherited abstract-level text produced contradictory public provenance. Immutable versions, active-summary precedence, and explicit extraction status reduce that risk.

For practitioners, the schema offers a checklist for designing and reporting a pilot before alert counts become conclusions. For researchers, the corpus supplies a versioned starting point and a record of missingness. Future value depends on prospective screening, structured outcome extraction, independent review, and evaluations that include failure and negative cases.

## XII. Conclusion

Cyberdeception Atlas provides a source-bounded evidence architecture, corrective versioned corpus, reporting schema, and reproducible conformance artifact. The current evidence supports descriptive corpus statements and implementation-level reporting claims. It does not support exhaustive-field, comparative-effectiveness, or risk-reduction claims. The next scientific milestone is independent evaluation of reporting completeness and claim-level extraction of comparable outcomes.

## Data and Artifact Availability

Release v2026.09.2 includes the catalog, relationships, protocol, codebook, analysis tables and figures, conformance-test observations, manifests, licenses, and checksums at https://cyberdeceptionatlas.org/en/downloads/. The live manifest, codebook, analysis report, pilot observations, and archive were checked against their local SHA-256 hashes on 23 September 2026. The four-model extraction records are separate private pilot artifacts, not included in that public release. A DOI has not yet been assigned.

## Competing Interests

Federico Pacheco is Cybersecurity Services Director at BASE4 Security. Both Federico Pacheco and Diego Staino are coauthors of BUDA, DOLOS-T, and Cyber Deception Playground. These relationships are disclosed, and the projects are not treated as independent evidence of defensive effectiveness.

## References

[1] Z. Lu, C. Wang, and S. Zhao, “Cyber Deception for Computer and Network Security: Survey and Challenges,” 2020. [Online]. Available: https://arxiv.org/abs/2007.14497

[2] J. Pawlick, E. Colbert, and Q. Zhu, “A Game-Theoretic Taxonomy and Survey of Defensive Deception for Cybersecurity and Privacy,” 2017. [Online]. Available: https://arxiv.org/abs/1712.05441

[3] P. Beltrán López, M. Gil Pérez, and P. Nespoli, “Cyber Deception: State of the Art, Trends and Open Challenges,” 2024. [Online]. Available: https://arxiv.org/abs/2409.07194

[4] UK National Cyber Security Centre, “Cyber deception trials: what we’ve learned so far,” 2025. [Online]. Available: https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far

[5] MITRE, “MITRE Engage.” [Online]. Available: https://github.com/mitre/engage

[6] Cyberdeception Atlas, “Corpus protocol, codebook, and corrective release v2026.09.2,” 2026.
