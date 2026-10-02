# Local HTTP decoy reporting pilot — protocol

**Protocol version:** 1.0  
**Environment:** isolated loopback (`127.0.0.1`)  
**Technique:** instrumented HTTP decoy objects  
**Purpose:** evaluate the Atlas reporting schema, not product effectiveness

## Research question

Can the Cyberdeception Atlas minimum reporting schema capture a controlled comparison between an uninstrumented baseline application and the same local application with instrumented decoy routes, including expected signals, missed signals, unwanted triggers, latency, investigability, and explicit non-evaluated outcomes?

## Hypothesis

For protocol-defined accesses to four decoy routes, the intervention will produce a schema-complete event within 100 ms for every authorized scenario. It will produce no event for four predefined benign or near-match routes. The baseline will produce no decoy events because it contains no decoy-event instrumentation.

This hypothesis concerns the deterministic local instrumentation. It does not predict attacker behavior, production effectiveness, decoy realism, or risk reduction.

## Experimental conditions

- **Baseline:** local HTTP application with normal routes and generic 404 responses; no decoy routes or decoy-event instrumentation.
- **Intervention:** the same application plus four exact decoy routes and structured event capture.
- **Binding:** loopback IPv4 only; no inbound public exposure and no outbound network requests.
- **Runs:** 10 repetitions of each scenario in each condition.
- **Execution:** sequential requests to avoid treating load testing as part of this pilot.
- **Clock:** monotonic high-resolution Node.js clock for latency; UTC wall-clock timestamps for observation records.

## Scenarios

### Expected decoy signals

1. `GET /.env`
2. `GET /admin-backup.zip`
3. `GET /finance/q4-payroll.csv`
4. `GET /api/internal/token?key=atlas-decoy`

### Benign and negative controls

1. `GET /`
2. `GET /health`
3. `GET /robots.txt`
4. `GET /admin-backup.zip.txt` — deliberately similar but not an exact decoy route

The query string is retained in event context but matching is performed on the normalized pathname.

## Expected responses and signals

| Condition    | Scenario class | HTTP behavior                  | Expected decoy event |
| ------------ | -------------- | ------------------------------ | -------------------- |
| Baseline     | Decoy access   | Generic 404                    | No                   |
| Baseline     | Benign/control | Normal response or generic 404 | No                   |
| Intervention | Decoy access   | Synthetic decoy response       | Yes                  |
| Intervention | Benign/control | Same behavior as baseline      | No                   |

## Investigability criteria

An event is considered investigable only when it contains all of:

- unique scenario identifier;
- UTC event timestamp;
- request method;
- normalized path and original URL;
- loopback source address;
- user-agent string;
- response status; and
- condition identifier.

No subjective analyst-quality claim is made. “Investigable” in this pilot is retained as a legacy field name and means only schema completeness against protocol-defined fields.

## Measures

- **Scenario coverage:** decoy scenarios producing the expected event / decoy scenarios run.
- **Time to alert:** event-capture time minus request-start time, reported as median, p95, minimum, maximum, and n.
- **Investigable alerts:** events meeting every criterion / all decoy events.
- **Unwanted triggers:** benign/control requests producing a decoy event / benign/control requests run.
- **Missed alerts:** decoy requests without a decoy event.
- **Operating load:** automated runtime and dependency count are measured; human installation, tuning, maintenance, and investigation hours are reported as not measured rather than zero.
- **Decoy recognition:** not evaluated because no human or autonomous adversary judges realism.
- **Safety incidents:** non-loopback connections, non-loopback binding, or outbound requests. The runner fails closed if the server is not bound to `127.0.0.1`.

## Analysis

Report counts with denominators for both conditions. The 100 ms threshold is a local instrumentation assertion, not a service-level objective for production alert delivery. Preserve every observation, including negative controls and missed events. Do not run a significance test: the scenarios are deterministic scripted checks rather than a random sample of attacks.

## Stop conditions

Stop immediately if the service binds outside loopback, a non-loopback client is observed, an outbound request is attempted, or the process cannot associate an event with its scenario identifier.

## Limitations fixed before execution

- Single process, host, runtime, and sequential workload.
- Synthetic requests with known routes.
- No SIEM, network latency, queue, analyst, or incident-response workflow.
- No adversary and therefore no realism or decoy-recognition measurement.
- No claim about commercial or open-source deception products.
- Repeated requests verify instrumentation consistency; they do not create independent evidence about attacker populations.
