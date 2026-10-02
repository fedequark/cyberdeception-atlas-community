# Cyberdeception Atlas codebook

**Version:** 1.0, applicable to corpus release `v2026.09`

## Record-level variables

| Variable                   | Type               | Allowed values or rule                                                                       | Interpretation                                                     |
| -------------------------- | ------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `id`, `slug`               | string             | Stable, unique identifier                                                                    | Must not be reused for a different resource.                       |
| `kind`                     | categorical        | `product`, `service`, `paper`, `software`, `case-study`, `dataset`, `framework`, `community` | Resource type, not evidence strength.                              |
| `name`                     | string             | Source-supported title or product name                                                       | Preserve official capitalization where practical.                  |
| `organization`             | string             | Author, publisher, maintainer, or provider                                                   | Role depends on resource type.                                     |
| `source_url`               | URL                | HTTPS primary or authoritative source                                                        | The provenance anchor for the record.                              |
| `summary_es`, `summary_en` | string             | Original, source-bounded summaries                                                           | Must not exceed what the reviewed source supports.                 |
| `year`                     | integer/null       | Publication or release year                                                                  | Unknown remains null.                                              |
| `status`                   | categorical        | `draft`, `published`, `archived`                                                             | Only published records enter public releases.                      |
| `reviewed_at`              | date               | ISO `YYYY-MM-DD`                                                                             | Date of the latest source review.                                  |
| `updated_at`               | date/time          | ISO value                                                                                    | Editorial update timestamp.                                        |
| `evidence`                 | categorical string | Descriptive source/evidence label                                                            | Legacy labels are retained; analysis must also use `review_basis`. |

## Provenance and classification variables in `data`

| Variable                           | Type         | Coding rule                                                                                                                                    |
| ---------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `review_basis`                     | categorical  | Material actually examined: `source-page`, `repository-metadata`, `publisher-metadata`, `abstract`, or `full-text`. It is not a quality score. |
| `access_date`                      | date         | Date on which the source was accessed.                                                                                                         |
| `source_title`                     | string       | Title displayed by the source or publisher.                                                                                                    |
| `techniques`                       | string array | One or more controlled technique labels; code behavior, not marketing language.                                                                |
| `environments`                     | string array | One or more environments in which the resource is explicitly applicable.                                                                       |
| `tags`                             | string array | Supplemental discovery terms; must not replace controlled fields.                                                                              |
| `doi`                              | string       | Lowercase canonical DOI without URL prefix when verified.                                                                                      |
| `authors`                          | string array | Ordered author names when verified.                                                                                                            |
| `journal`                          | string       | Venue or journal when verified.                                                                                                                |
| `license`                          | string       | SPDX identifier where possible; otherwise exact documented license.                                                                            |
| `source_language`                  | string/array | Language explicitly observed in the source. Do not infer from organization country.                                                            |
| `organization_country`             | string       | Supported organization location, used only where meaningful for products/services.                                                             |
| `limitations_es`, `limitations_en` | string       | Source-specific interpretation limits.                                                                                                         |
| `extraction_status`                | string       | Extraction workflow actually completed; never imply dual review.                                                                                |
| `adjudication_status`              | string       | Whether an independent second extraction and disagreement resolution occurred.                                                                  |
| `page_anchors`                     | string array | Page, section, table, or figure anchors retained during extraction; empty means not retained.                                                    |
| `provenance_note_es`, `provenance_note_en` | string | Public disclosure of extraction limitations.                                                                                          |

## Controlled technique labels

- `Honeypot`: simulated system or service intended to receive and record unauthorized interaction.
- `Honeytoken`: decoy data, credential, identifier, or object whose use or access provides a signal.
- `Decoy`: deceptive asset or object not more specifically coded as a honeypot or honeytoken.
- `Adversary engagement`: planned interaction intended to observe, influence, or impose cost on an adversary.
- `Moving target defense`: change to attack surface or configuration coded only when the source connects it to deception.

New technique values require a definition, mapping decision, and migration note. Tags copied from legacy records should be normalized before cross-study comparison.

## Controlled environment labels

- `Network`: network services, infrastructure, or traffic paths.
- `Identity`: accounts, credentials, directories, or identity control planes.
- `Cloud`: cloud services, control planes, workloads, or hybrid cloud context.
- `Application`: applications, APIs, and application-layer surfaces.
- `OT/ICS`: operational technology, industrial control, or cyber-physical process environments.
- `Endpoint`: workstations, servers, or host-level artifacts.
- `IoT`: embedded or connected devices outside a more specific OT/ICS classification.

## Critical-reading object

| Variable                           | Rule                                                      |
| ---------------------------------- | --------------------------------------------------------- |
| `observation_es`, `observation_en` | What the reviewed source permits the Atlas to state.      |
| `limitations_es`, `limitations_en` | What remains unsupported, unknown, or non-generalizable.  |
| `question_es`, `question_en`       | A concrete question required for evaluation or follow-up. |
| `reviewed_at`                      | Date of the critical reading.                             |

A critical reading is not an independent experiment and does not upgrade the underlying review basis.

## Outcome variables for full-text and worked evaluations

These variables are prospective and are not assumed present in `v2026.09`:

| Variable              | Type              | Minimum coding rule                                                           |
| --------------------- | ----------------- | ----------------------------------------------------------------------------- |
| `evaluation_setting`  | categorical       | `simulation`, `laboratory`, `field`, `production`, `not-reported`.            |
| `sample_size`         | number/null       | Unit and denominator must be stated.                                          |
| `baseline`            | string/null       | Comparator or pre-intervention condition.                                     |
| `scenario_count`      | number/null       | Authorized scenarios attempted, including those with no signal.               |
| `scenario_coverage`   | ratio/null        | Scenarios producing expected signal / scenarios run.                          |
| `time_to_alert`       | distribution/null | Clock definition, median, range/IQR, and n.                                   |
| `investigable_alerts` | ratio/null        | Alerts meeting predefined usefulness criteria / all alerts.                   |
| `unwanted_triggers`   | ratio/null        | Legitimate actions triggering the lure / legitimate actions tested.           |
| `operating_load`      | number/null       | Installation, tuning, maintenance, and investigation hours per stated period. |
| `decoy_recognition`   | ratio/null        | Interactions in which the decoy was recognized / evaluated interactions.      |
| `safety_incidents`    | count/null        | Report zero only when incidents were actively observed and counted.           |
| `negative_results`    | boolean/text      | Missed signals, failed scenarios, or contradictory findings.                  |
| `artifact_available`  | boolean/URL       | Public configuration, data, or code supporting reproduction.                  |

## Missingness and inference rules

- Use `null`, absence, or an empty list to mean unknown/not recorded; never translate unknown to “none.”
- Do not infer geography from a top-level domain, language from a country, effectiveness from popularity, or deployment from product capability.
- Do not infer full-text review from the presence of a DOI or abstract.
- A `full-text` label means the publication informed the synthesis; it does not imply dual extraction, page-level traceability, or quality appraisal. Report those properties separately.
- Report numerator and denominator together.
- Preserve vendor attribution and conflicts of interest in every derived analysis.
