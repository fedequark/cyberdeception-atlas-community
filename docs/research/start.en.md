# First cyber deception deployment

**Guide · 15 September 2026**

## Choose a detection question

Start with an action that should not happen: opening a decoy file, using a fictional credential or connecting to a simulated internal service. The question should explain why the interaction warrants investigation.

## Choose the resource

A honeytoken works when decoy data can be placed credibly and its alert mechanism is verified. A honeypot helps when network or protocol interaction must be observed. [OpenCanary](https://github.com/thinkst/opencanary) documents a multi-protocol internal-network approach; [Cowrie](https://github.com/cowrie/cowrie) focuses on SSH and Telnet. Choose for the behavior you seek, not the tool's feature count.

## Prepare the environment

Identify where the adversary would see the decoy, how the team receives an alert and what happens if someone engages further. Separate the decoy from production assets and document configuration changes. For a lab platform such as [T-Pot](https://github.com/telekom-security/tpotce), study requirements and limits before exposing it to the public internet.

## Define response and observation

An alert needs an owner, priority and verification steps. Use an authorized test interaction, recording alert delay and available details. Then observe for a defined period: interaction volume, signal usefulness and review effort.

## Decide whether to expand

Expand if the decoy produces actionable information and stays credible. Change placement or design if it catches only mass scans without the desired signal. Document missed events and false positives too.

The [UK NCSC](https://www.ncsc.gov.uk/blog-post/cyber-deception-trials-what-weve-learned-so-far) found that deception can work, but needs strategy, context and useful measures.
