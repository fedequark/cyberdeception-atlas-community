import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';

const repetitions = Number.parseInt(process.argv[2] ?? '10', 10);
if (!Number.isInteger(repetitions) || repetitions < 1 || repetitions > 1000) {
  throw new Error('Repetitions must be an integer between 1 and 1000.');
}

const experimentId = 'http-decoy-pilot-v1';
const resultsDir = new URL('./results/', import.meta.url);
const decoyScenarios = [
  { key: 'env-file', method: 'GET', url: '/.env' },
  { key: 'admin-backup', method: 'GET', url: '/admin-backup.zip' },
  { key: 'payroll-file', method: 'GET', url: '/finance/q4-payroll.csv' },
  { key: 'internal-token', method: 'GET', url: '/api/internal/token?key=atlas-decoy' },
];
const benignScenarios = [
  { key: 'home', method: 'GET', url: '/' },
  { key: 'health', method: 'GET', url: '/health' },
  { key: 'robots', method: 'GET', url: '/robots.txt' },
  { key: 'near-match', method: 'GET', url: '/admin-backup.zip.txt' },
];
const decoyPaths = new Set(
  decoyScenarios.map((scenario) => new URL(scenario.url, 'http://local').pathname),
);
const starts = new Map();
const events = [];
const safetyIncidents = [];

function isLoopback(address) {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function createApplication(condition) {
  return createServer((request, response) => {
    const remoteAddress = request.socket.remoteAddress ?? 'unknown';
    if (!isLoopback(remoteAddress)) {
      safetyIncidents.push({ type: 'non-loopback-client', remote_address: remoteAddress });
      response.writeHead(403).end('Forbidden');
      return;
    }

    const scenarioId = request.headers['x-atlas-scenario-id'];
    const url = new URL(request.url ?? '/', 'http://local');
    const isDecoy = condition === 'intervention' && decoyPaths.has(url.pathname);

    if (isDecoy) {
      const startedAt = starts.get(scenarioId);
      const capturedAt = performance.now();
      const status = 200;
      events.push({
        scenario_id: scenarioId ?? null,
        condition,
        event_time_utc: new Date().toISOString(),
        method: request.method ?? null,
        path: url.pathname,
        original_url: request.url ?? null,
        remote_address: remoteAddress,
        user_agent: request.headers['user-agent'] ?? null,
        response_status: status,
        latency_ms:
          typeof startedAt === 'number' ? Number((capturedAt - startedAt).toFixed(3)) : null,
      });
      response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Synthetic decoy object. No production data.\n');
      return;
    }

    if (url.pathname === '/') {
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Local evaluation service\n');
      return;
    }
    if (url.pathname === '/health') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end('{"status":"ok"}\n');
      return;
    }
    if (url.pathname === '/robots.txt') {
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('User-agent: *\nDisallow: /\n');
      return;
    }

    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found\n');
  });
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string' || address.address !== '127.0.0.1') {
    safetyIncidents.push({ type: 'invalid-bind', address });
    await close(server);
    throw new Error('Experiment refused to run outside IPv4 loopback.');
  }
  return address.port;
}

async function close(server) {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

function isInvestigable(event) {
  return Boolean(
    event &&
    event.scenario_id &&
    event.event_time_utc &&
    event.method &&
    event.path &&
    event.original_url &&
    isLoopback(event.remote_address) &&
    event.user_agent &&
    Number.isInteger(event.response_status) &&
    event.condition,
  );
}

const observations = [];
const experimentStarted = performance.now();

for (const condition of ['baseline', 'intervention']) {
  const server = createApplication(condition);
  const port = await listen(server);
  try {
    for (const scenarioClass of ['decoy', 'benign']) {
      const scenarios = scenarioClass === 'decoy' ? decoyScenarios : benignScenarios;
      for (const scenario of scenarios) {
        for (let repetition = 1; repetition <= repetitions; repetition += 1) {
          const scenarioId = `${condition}-${scenarioClass}-${scenario.key}-${String(repetition).padStart(2, '0')}`;
          const actionTime = new Date().toISOString();
          starts.set(scenarioId, performance.now());
          const response = await fetch(`http://127.0.0.1:${port}${scenario.url}`, {
            method: scenario.method,
            headers: {
              'user-agent': 'CyberdeceptionAtlasLocalEvaluation/1.0',
              'x-atlas-scenario-id': scenarioId,
            },
          });
          await response.text();
          const event = events.find((candidate) => candidate.scenario_id === scenarioId) ?? null;
          observations.push({
            scenario_id: scenarioId,
            objective: 'Evaluate source-bounded decoy reporting schema',
            environment: 'Local loopback HTTP',
            technique: 'Decoy',
            decoy_or_product: 'Atlas HTTP decoy pilot',
            version: '1.0',
            baseline:
              condition === 'baseline'
                ? 'Uninstrumented local application'
                : 'Baseline plus exact instrumented decoy routes',
            condition,
            scenario_class: scenarioClass,
            method: scenario.method,
            path: scenario.url,
            http_status: response.status,
            action_time_utc: actionTime,
            alert_time_utc: event?.event_time_utc ?? null,
            alert_received: Boolean(event),
            alert_investigable: isInvestigable(event),
            legitimate_action: scenarioClass === 'benign',
            decoy_detected: null,
            latency_ms: event?.latency_ms ?? null,
            installation_hours: null,
            maintenance_hours: null,
            investigation_hours: null,
            safety_incident: false,
            source_url: null,
            source_access_date: '2026-09-18',
            observer: 'Automated local experiment runner',
            notes:
              scenarioClass === 'benign' && scenario.key === 'near-match'
                ? 'Negative control similar to a decoy route; exact pathname matching expected.'
                : null,
          });
          starts.delete(scenarioId);
        }
      }
    }
  } finally {
    await close(server);
  }
}

const experimentRuntimeMs = Number((performance.now() - experimentStarted).toFixed(3));

function percentile(values, probability) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.max(0, Math.ceil(probability * sorted.length) - 1)];
}

function summarize(condition) {
  const rows = observations.filter((row) => row.condition === condition);
  const decoys = rows.filter((row) => row.scenario_class === 'decoy');
  const benign = rows.filter((row) => row.scenario_class === 'benign');
  const alerts = rows.filter((row) => row.alert_received);
  const latencies = alerts.map((row) => row.latency_ms).filter(Number.isFinite);
  return {
    requests: rows.length,
    decoy_scenarios: decoys.length,
    benign_controls: benign.length,
    decoy_alerts: decoys.filter((row) => row.alert_received).length,
    missed_decoy_alerts: decoys.filter((row) => !row.alert_received).length,
    unwanted_triggers: benign.filter((row) => row.alert_received).length,
    investigable_alerts: alerts.filter((row) => row.alert_investigable).length,
    total_alerts: alerts.length,
    scenario_coverage: decoys.length
      ? decoys.filter((row) => row.alert_received).length / decoys.length
      : null,
    unwanted_trigger_rate: benign.length
      ? benign.filter((row) => row.alert_received).length / benign.length
      : null,
    investigable_alert_rate: alerts.length
      ? alerts.filter((row) => row.alert_investigable).length / alerts.length
      : null,
    latency_ms: {
      n: latencies.length,
      min: latencies.length ? Math.min(...latencies) : null,
      median: percentile(latencies, 0.5),
      p95: percentile(latencies, 0.95),
      max: latencies.length ? Math.max(...latencies) : null,
    },
  };
}

const summary = {
  experiment_id: experimentId,
  protocol_version: '1.0',
  executed_at_utc: new Date().toISOString(),
  runtime: {
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
    experiment_runtime_ms: experimentRuntimeMs,
    external_dependencies: 0,
  },
  design: {
    repetitions_per_scenario: repetitions,
    decoy_scenarios_per_condition: decoyScenarios.length * repetitions,
    benign_controls_per_condition: benignScenarios.length * repetitions,
    sequential_requests: true,
    network_scope: '127.0.0.1 only',
  },
  baseline: summarize('baseline'),
  intervention: summarize('intervention'),
  safety_incidents: safetyIncidents,
  not_measured: [
    'Human installation time',
    'Human tuning and maintenance time',
    'Human investigation time',
    'Decoy realism or recognition',
    'Production alert delivery latency',
    'Risk reduction',
  ],
};

const hypothesisChecks = {
  intervention_coverage_is_complete: summary.intervention.scenario_coverage === 1,
  intervention_has_no_unwanted_triggers: summary.intervention.unwanted_trigger_rate === 0,
  intervention_alerts_are_investigable: summary.intervention.investigable_alert_rate === 1,
  intervention_p95_under_100_ms:
    summary.intervention.latency_ms.p95 != null && summary.intervention.latency_ms.p95 < 100,
  baseline_has_no_decoy_events: summary.baseline.total_alerts === 0,
  no_safety_incidents: safetyIncidents.length === 0,
};
summary.hypothesis_checks = hypothesisChecks;
summary.hypothesis_supported = Object.values(hypothesisChecks).every(Boolean);

function csv(rows) {
  const fields = Object.keys(rows[0]);
  const escape = (value) => {
    if (value == null) return '';
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  return `${[fields, ...rows.map((row) => fields.map((field) => row[field]))]
    .map((row) => row.map(escape).join(','))
    .join('\n')}\n`;
}

const intervention = summary.intervention;
const report = `# Local HTTP decoy reporting pilot — results

**Experiment:** ${experimentId}  
**Executed:** ${summary.executed_at_utc}  
**Runtime:** Node ${summary.runtime.node} on ${summary.runtime.platform}/${summary.runtime.architecture}

## Result

The protocol-defined instrumentation hypothesis was **${summary.hypothesis_supported ? 'supported' : 'not supported'}** in this isolated run. Protocol and results first entered repository history together, so prospective timing is not independently verifiable. This verifies the local event and reporting pipeline only; it does not demonstrate production effectiveness, analyst usefulness, improved auditability, or risk reduction.

| Measure | Baseline | Intervention |
| --- | ---: | ---: |
| Decoy scenarios | ${summary.baseline.decoy_scenarios} | ${intervention.decoy_scenarios} |
| Decoy alerts | ${summary.baseline.decoy_alerts} | ${intervention.decoy_alerts} |
| Missed decoy alerts | ${summary.baseline.missed_decoy_alerts} | ${intervention.missed_decoy_alerts} |
| Scenario coverage | ${(100 * summary.baseline.scenario_coverage).toFixed(1)}% | ${(100 * intervention.scenario_coverage).toFixed(1)}% |
| Benign/negative controls | ${summary.baseline.benign_controls} | ${intervention.benign_controls} |
| Unwanted triggers | ${summary.baseline.unwanted_triggers} | ${intervention.unwanted_triggers} |
| Investigable alerts | ${summary.baseline.investigable_alerts}/${summary.baseline.total_alerts} | ${intervention.investigable_alerts}/${intervention.total_alerts} |

Intervention event-capture latency was median ${intervention.latency_ms.median} ms, p95 ${intervention.latency_ms.p95} ms, range ${intervention.latency_ms.min}–${intervention.latency_ms.max} ms (n=${intervention.latency_ms.n}). This excludes SIEM transport, queues, analyst handling, and response.

## Negative and null results

- The baseline produced no decoy events, including for ${summary.baseline.decoy_scenarios} scripted accesses.
- The intervention produced ${intervention.unwanted_triggers} unwanted triggers across ${intervention.benign_controls} benign and near-match controls.
- Human operating time, decoy recognition, production latency, and risk reduction were not measured and are not assigned zero values.
- Safety incidents observed: ${summary.safety_incidents.length}.

## Interpretation

The pilot demonstrates that the Atlas protocol can serialize baseline behavior, expected events, negative controls, denominators, latency, schema completeness, explicit missing measures, and safety observations in one reproducible package. It is a conformance test, not a comparative validation of the schema. The perfect intervention coverage is structurally expected for exact routes in a single-process deterministic test; repeated requests are checks, not independent samples, and must not be generalized to real attackers or environments.

## Reproduction

Run \`npm run experiment:http-decoy\`. The runner binds only to \`127.0.0.1\`, makes no outbound requests, records all observations, and fails if any prespecified hypothesis or safety check fails.
`;

const outputFiles = {
  'summary.json': `${JSON.stringify(summary, null, 2)}\n`,
  'observations.csv': csv(observations),
  'events.json': `${JSON.stringify(events, null, 2)}\n`,
  'report.md': report,
};
const resultManifest = {
  experiment_id: experimentId,
  protocol_version: '1.0',
  executed_at_utc: summary.executed_at_utc,
  files: Object.fromEntries(
    Object.entries(outputFiles).map(([name, content]) => [
      name,
      {
        bytes: Buffer.byteLength(content),
        sha256: createHash('sha256').update(content).digest('hex'),
      },
    ]),
  ),
};

await mkdir(resultsDir, { recursive: true });
await Promise.all([
  ...Object.entries(outputFiles).map(([name, content]) =>
    writeFile(new URL(name, resultsDir), content),
  ),
  writeFile(new URL('manifest.json', resultsDir), `${JSON.stringify(resultManifest, null, 2)}\n`),
]);

console.log(
  JSON.stringify({
    output: 'experiments/http-decoy-pilot-v1/results',
    hypothesis_supported: summary.hypothesis_supported,
    baseline_requests: summary.baseline.requests,
    intervention_requests: summary.intervention.requests,
    intervention_alerts: summary.intervention.total_alerts,
    unwanted_triggers: summary.intervention.unwanted_triggers,
    p95_latency_ms: summary.intervention.latency_ms.p95,
  }),
);

if (!summary.hypothesis_supported) process.exitCode = 1;
