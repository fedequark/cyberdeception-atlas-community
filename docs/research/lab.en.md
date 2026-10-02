# Reproducible research lab

**Guide · 15 September 2026**

## State a hypothesis

A hypothesis describes what changes when deception is introduced. For example: “an SSH honeypot in a test network detects lateral-movement attempts earlier than baseline instrumentation.” Define observable events and a comparison that could refute the claim.

## Record conditions

Keep software versions, configuration, topology, simulated services, duration, time of day and traffic load. [Cowrie](https://github.com/cowrie/cowrie) supports SSH/Telnet studies; [T-Pot](https://github.com/telekom-security/tpotce) combines sensors and analysis. Change one main variable per experiment. State what ran in an isolated lab and what represents real operations.

## Define adversary and baseline

Use authorized tests describing observable actions: reconnaissance, access attempts or decoy-data use. Measure a baseline without deception. If the network, detection rules and decoy all change at once, outcomes cannot be attributed to one cause.

## Preserve evidence

Publish scripts and configuration where possible, with synthetic or de-identified data. Define event fields, exclusion rules, clocks and capture errors. [Network attack simulation research](https://arxiv.org/abs/2301.10629) illustrates an approach to comparing honeypots and moving target defense.

## Analyze outcomes and limits

Report positive and negative outcomes, variation across runs and out-of-scope cases. Distinguish automated interactions from more complex behavior when evidence supports it. A lab result does not predict outcomes for every organization.
