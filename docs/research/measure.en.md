# Measuring outcomes

**Guide · 15 September 2026**

## Define success

Choose an observable goal before deployment. “Detect misuse of decoy credentials” is more measurable than “improve security.” Agree who judges an alert useful and what data they need.

## Detection measures

- **Time to alert:** difference between a test action and the first event received by the team.
- **Useful interactions:** events supporting a concrete investigation, separated from mass scans.
- **Coverage:** share of authorized scenarios producing the intended signal.
- **Alert quality:** available fields, attribution, context and response steps.

## Operating measures

- Time for installation, tuning and maintenance.
- Incidents from configuration or unexpected engagement.
- Decoys that lose credibility after infrastructure changes.
- Total operating cost, including event investigation.

## Comparison

Record a baseline period or environment. Document simultaneous changes to users, assets, controls and simulated adversaries. Report observation counts and missed alerts. Academic studies should retain parameters and data allowing replication.

## Interpretation

High interaction may indicate good placement, mass-scanner exposure or noise. Low interaction may indicate few observable adversaries or poor placement. Conclusions must relate results, threat and context; alert counts alone do not demonstrate lower risk. The [UK NCSC](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) identified outcome measures as a field gap.
