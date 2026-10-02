# Local HTTP decoy reporting pilot — results

**Experiment:** http-decoy-pilot-v1  
**Executed:** 2026-09-18T18:14:34.858Z  
**Runtime:** Node v24.18.0 on win32/x64

## Result

The protocol-defined instrumentation hypothesis was **supported** in this isolated run. Protocol and results first entered repository history together, so prospective timing is not independently verifiable. This verifies the local event and reporting pipeline only; it does not demonstrate production effectiveness, analyst usefulness, improved auditability, or risk reduction.

| Measure | Baseline | Intervention |
| --- | ---: | ---: |
| Decoy scenarios | 40 | 40 |
| Decoy alerts | 0 | 40 |
| Missed decoy alerts | 40 | 0 |
| Scenario coverage | 0.0% | 100.0% |
| Benign/negative controls | 40 | 40 |
| Unwanted triggers | 0 | 0 |
| Investigable alerts | 0/0 | 40/40 |

Intervention event-capture latency was median 14.889 ms, p95 17.022 ms, range 0.222–17.483 ms (n=40). This excludes SIEM transport, queues, analyst handling, and response.

## Negative and null results

- The baseline produced no decoy events, including for 40 scripted accesses.
- The intervention produced 0 unwanted triggers across 40 benign and near-match controls.
- Human operating time, decoy recognition, production latency, and risk reduction were not measured and are not assigned zero values.
- Safety incidents observed: 0.

## Interpretation

The pilot demonstrates that the Atlas protocol can serialize baseline behavior, expected events, negative controls, denominators, latency, schema completeness, explicit missing measures, and safety observations in one reproducible package. It is a conformance test, not a comparative validation of the schema. The perfect intervention coverage is structurally expected for exact routes in a single-process deterministic test; repeated requests are checks, not independent samples, and must not be generalized to real attackers or environments.

## Reproduction

Run `npm run experiment:http-decoy`. The runner binds only to `127.0.0.1`, makes no outbound requests, records all observations, and fails if any prespecified hypothesis or safety check fails.
