# Content architecture

## Positioning

Cyberdeception Atlas helps a security team move from a detection question to a measurable deception test. The professional route is **define the behavior → explore options → check the evidence → plan the test**. The site provides orientation, source context and reporting guidance; a team's own test determines the outcome in its environment.

The home page leads with that route and a concrete decoy-credential example. Corpus counts appear as qualified evidence of what is in the collection, after the route is explained. Research and methodology provide the basis for checking claims, provenance and limitations. The scientific manuscript keeps its separate, narrower claims.

Use decision language on entry pages: “what behavior do you want to detect?”, “what material was reviewed?” and “what would you measure?”. Describe `review_basis` as the **material examined**, never as a product-quality or effectiveness score. Inclusion does not imply endorsement, worldwide coverage or operational validation.

## Navigation

The Atlas is a question-led reference site for practitioners and researchers. The main navigation answers six different questions:

| Entry | User question | Content |
| --- | --- | --- |
| Home | How do I turn a detection question into a test? | Decision route, worked credential example, topic map and qualified coverage |
| By problem / Topics | What behavior do I want to detect? | Example questions, techniques, environments and linked sources |
| Library | Which specific resource am I looking for? | Searchable, filtered, source-linked records |
| Evidence | What supports a claim? | Papers, datasets, field reports and editorial syntheses with review basis |
| Ecosystem | What options relate to my hypothesis? | Products, services, open software and evaluation guide |
| Plan a test / Practice | What signal and outcome would inform a decision? | Deployment, evaluation, lab and measurement guides |

Techniques and environments are independent labels on each record. A honeypot can appear in Network or OT/ICS; Identity can include honeytokens and decoys. This supports discovery by subject without collapsing different resource types into a single long list. Editorial synthesis remains in `/research/[slug]` so established document links continue to work. Old catalog URLs with filters redirect to `/library` with their query preserved.

The pattern is informed by the cross-cutting topic navigation used by [NIST CSRC](https://csrc.nist.gov/topics), the technique and decoy-object vocabulary in [MITRE D3FEND](https://d3fend.mitre.org/), and the Prepare–Operate–Understand planning process of [MITRE Engage](https://engage.mitre.org/wp-content/uploads/2022/04/EngageHandbook-v1.0.pdf). The Atlas's topic labels and crosswalk are editorial navigation, not an official MITRE taxonomy.

The phrase “global reference” describes the intended scope and publishing model, not a claim of complete worldwide coverage. Each resource has a linked source, review depth and date. Vendor claims, threat observations, customer stories and independent evaluation remain distinguishable. Topic counts are counts of tagged Atlas records, not market share or worldwide literature totals. Contributions are reviewed before publication.

`/coverage` reports resource-type, technique, environment and review-depth counts from published D1 records. It also shows how many records lack verified organization country, deployment regions, sectors and source language. Geographic availability is not inferred from an organization's address. The owner editor can enter these fields separately, with source review, before publication. Thirty initial record pages have source-bounded critical-reading notes and evaluation questions; those notes do not claim independent testing or full-text reading. The library exposes them with `?critical=1` and a visible badge. The practical section publishes a bilingual comparison protocol and CSV scenario template.

Search engines and external readers can discover the main paths, topics, documents and published resource pages through `/sitemap.xml`. Each bilingual page has a canonical URL and Spanish/English alternate links. The public JSON, CSV, BibTeX and Markdown exports support research reuse.
