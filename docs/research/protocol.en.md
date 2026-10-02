# Comparable evaluation protocol

**Research and procurement template · September 15, 2026**

A comparison is valid only when options face the same objective, environment, scenario and observation period. This protocol also records missed alerts and the work required to operate decoys. Unknown data do not receive a score.

## 1. Question, scope and baseline

Write an observable hypothesis: for example, “using a decoy identity credential produces an investigable alert within five minutes.” Record environment, technique, decoy placement, alert integration, observation period and existing controls. The baseline can be the same test without the decoy or the current detection control. Document concurrent changes.

## 2. Source for every claim

Separate **vendor-declared capability**, **demo observation**, **your own test result** and **independently published result**. For each claim, save URL or DOI, access date, version or offering examined, and source limitations. An abstract or commercial page does not replace an independent evaluation.

## 3. Test design

Define authorized scenarios before running them. Specify how each action is generated, repetitions, clock synchronization and expected signal. Test legitimate or maintenance traffic that could trigger the lure. For OT/ICS, isolate tests from production processes and document process-safety review.

## 4. Measures with denominators

| Measure | Calculation or record | Interpretation |
| --- | --- | --- |
| Scenario coverage | Scenarios producing the expected signal / scenarios run | Include scenarios with no alert. |
| Time to alert | First received event minus action time | Show median, range and sample size. |
| Investigable alerts | Alerts with sufficient context / all alerts | Define the usefulness assessor in advance. |
| Unwanted triggers | Triggers from legitimate actions / legitimate actions tested | Separate tests, indexers and maintenance. |
| Operating load | Installation, tuning, maintenance and investigation hours | Report per period and number of decoys. |
| Decoy realism | Decoy detections / evaluated interactions | Document assessor criteria and behavior. |
| Safety incidents | Incidents caused by the decoy or configuration | Record even when the result is zero. |

## 5. Analysis and decision

Publish sample size, test conditions, negative cases, missing data and differences from the baseline. Do not extrapolate laboratory results to production without explaining the gap. When comparing products or services, record deployment model, integration, operating responsibility, license and total cost **only where verifiable support exists**. Missing public pricing stays “unknown.”

## 6. Reproducibility and review

Keep configuration, versions, action sequence, telemetry schema, assessment criteria and anonymized results where possible. The [CSV template](/downloads/evaluation-template.csv) supports scenario and observation logging. Review the protocol when the decoy or environment changes.

The [UK NCSC](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) identified a lack of comparable outcome metrics in its cyber deception trials. [MITRE Engage](https://engage.mitre.org/wp-content/uploads/2022/04/EngageHandbook-v1.0.pdf) offers a prepare, operate and understand framework; this protocol specifies how to record a comparison.
