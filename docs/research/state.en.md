# State of cyber deception

**Versioned evidence map · corrective release 2026.09.2**

The bilingual [project preprint](/en/downloads/#preprint) describes this release and its methodological limits. It is a candidate manuscript, not submitted or peer reviewed, and has no DOI yet.

This review connects academic research, open software, products and operational experience. Its scope is public information verified in the catalog. It separates author findings, vendor claims and third-party observations. Metadata-only paper records are not used to infer scientific results.

## Definition and boundaries

Cyber deception deliberately introduces signals or resources for an adversary to see, use or make decisions about. A honeypot simulates a system or service. A honeytoken is decoy data whose use produces an alert. Other assets may imitate credentials, files, applications or movement paths. Goals include detection, observation, diversion and imposing cost on adversary activity. [MITRE Engage](https://github.com/mitre/engage) is a framework for planning deception, denial and adversary engagement.

Terminology varies across disciplines. A [2024 survey](https://arxiv.org/abs/2409.07194) proposes a broad taxonomy and reviews research with and without AI. A [game-theoretic taxonomy](https://arxiv.org/abs/1712.05441) distinguishes perturbation, moving target defense, obfuscation, mixing, honey-x and attacker engagement. The Atlas therefore records technique, environment and goal separately. Moving target defense may be part of a deception strategy, but implementations are not automatically classified as cyber deception.

## Available approaches

Open projects cover different levels of interaction. [OpenCanary](https://github.com/thinkst/opencanary) is a multi-protocol network honeypot intended to detect activity inside networks. [Cowrie](https://github.com/cowrie/cowrie) focuses on SSH and Telnet. [T-Pot](https://github.com/telekom-security/tpotce) combines honeypots and analysis tools. [Galah](https://github.com/0x4D31/galah) explores language-model interaction in a web honeypot. Their records describe documentation and maintenance; inclusion is not a comparative performance judgment.

Commercial offerings combine decoys, trap data and security operations integrations. Documented examples include [Thinkst Canary](https://canary.tools/), [FortiDeceptor](https://www.fortinet.com/products/fortideceptor), [Acalvio ShadowPlex](https://www.acalvio.com/products/), [CounterCraft The Platform](https://www.countercraftsec.com/products/), [Zscaler Deception](https://www.zscaler.com/products-and-solutions/deception-technology) and [Tracebit](https://tracebit.com/). Those capabilities currently come from vendor pages. Public documentation or independent testing is needed before comparing prices, ease of deployment or outcomes.

Services include strategy design, deployment, managed operation, testing and education. Classification needs care: a manufacturer offering support is not automatically a managed service provider. The catalog adds services only when it finds a verifiable offering.

## Field evidence

In [December 2025 the UK NCSC reported](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) a program involving 121 organizations, 14 commercial providers and 10 product trials across several environments. Its findings identify potential for detection and intelligence, together with terminology confusion, a lack of outcome metrics, demand for impartial guidance and configuration risks. Deception requires operational context and strategy.

Customer stories can illuminate adoption problems, but source attribution matters. The [Riot Games story published by Tracebit](https://tracebit.com/customer/riot-games) describes interest in extending deception approaches to cloud. The Atlas labels it as a vendor-published story. Independent evaluation, if available, should be added as a separate source.

## Research directions

Research investigates network and host mechanisms, decision models, placement and measurement. The [Lu et al. survey](https://arxiv.org/abs/2007.14497) organizes strategic, network, host and cryptographic schemes. [Attack simulation research](https://arxiv.org/abs/2301.10629) proposes a network model for evaluating honeypots and moving target defense. A [network-requirements survey](https://arxiv.org/abs/2309.00184) examines conditions for effective deployment.

Language-model honeypots are a visible but heterogeneous research direction. [LLM Honeypot](https://arxiv.org/abs/2409.08234) describes fine-tuning with attacker commands and evaluating responses. [HoneyGPT](https://arxiv.org/abs/2406.01882) presents a terminal honeypot and field evaluation. These are the authors' findings, not evidence that every language model is safe, economical or superior to traditional decoys.

## Measurement and limits

A useful evaluation reports placement, legitimate traffic, observable attacks, alert quality, maintenance and consequences of engagement. Measures can include detection time, useful events per decoy, alerts requiring investigation, interaction depth and operational cost. The [NCSC](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) identified missing outcome measures. Alert counts alone do not establish lower risk.

The catalog should also record negative results, detected decoys, discontinued projects, name changes and unpublished data. These details help researchers assess reproducibility and teams compare investments.

## Current coverage and evidence boundary

The corrective release contains 187 public, source-linked records. Twenty records contain a full-text synthesis and 50 contain a source-bounded critical-reading note. These labels describe editorial work, not study quality or defensive effectiveness. The full-text syntheses were produced by one reviewer; page anchors and independent adjudication were not retained for this release. The corpus therefore remains a curated evidence map rather than a completed systematic or scoping review.

The reproducible sensitivity analysis shows how strongly the visible corpus depends on shallow source types: excluding repository-metadata records reduces the analytic view from 187 to 88. This is a statement about curation and public-source availability, not about adoption or prevalence in the cyber-deception field.

The accompanying loopback pilot records 80 baseline and 80 intervention requests. Exact instrumented routes produced the expected 40 events and 40 benign or near-match controls produced none. Because the event logic is deterministic and the baseline has no event instrumentation, this is a conformance test of the reporting pipeline—not evidence about attackers, production detection, analyst usefulness, or risk reduction.

Two ancillary extraction pilots used OpenAI, Claude, Gemini, and DeepSeek on two selected papers. They document model disagreement and a human adjudication workflow, but do not establish extraction accuracy, time savings, or independent validation of the catalog. The provider outputs and canonical adjudications remain private and are not in the public corrective release.

Prospective updates will retain complete search and screening ledgers, page-level extraction anchors, second-reviewer decisions, and outcome variables. Until those data exist, the Atlas does not claim exhaustive coverage or comparable effectiveness across products and studies.
