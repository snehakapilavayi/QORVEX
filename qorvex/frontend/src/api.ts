import {
  SimulationResult,
  BatchResult,
  PostProcessingResult,
  PaymentResponse,
  CircuitSchema,
  ExperimentHistoryRecord
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export async function fetchHealth(): Promise<{ status: string; version: string; platform: string }> {
  const r = await fetch(`${API_BASE}/api/health`);
  if (!r.ok) throw new Error(`Health check failed: ${r.status}`);
  return r.json();
}

export async function runSimulation(params: {
  bits: number;
  eve: boolean;
  eve_intensity?: number;
  noise: boolean;
  noise_probability?: number;
  threshold?: number;
  sample_fraction?: number;
  min_sample?: number;
  seed?: number | null;
}): Promise<SimulationResult> {
  const r = await fetch(`${API_BASE}/api/simulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!r.ok) throw new Error(`Simulation request failed: ${await r.text()}`);
  return r.json();
}

export async function runBatchSimulation(params: {
  runs: number;
  bits: number;
  eve: boolean;
  eve_intensity?: number;
  noise: boolean;
  noise_probability?: number;
  threshold?: number;
  seed?: number | null;
}): Promise<BatchResult> {
  const r = await fetch(`${API_BASE}/api/simulations/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!r.ok) throw new Error(`Batch request failed: ${await r.text()}`);
  return r.json();
}

export async function runPostProcessing(simulation_id: string): Promise<PostProcessingResult> {
  const r = await fetch(`${API_BASE}/api/simulations/post-processing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ simulation_id })
  });
  if (!r.ok) throw new Error(`Post-processing failed: ${await r.text()}`);
  return r.json();
}

export async function verifyPaymentDemo(params: {
  simulation_id: string;
  transaction_id?: string;
  sender?: string;
  receiver?: string;
  amount?: number;
}): Promise<PaymentResponse> {
  const r = await fetch(`${API_BASE}/api/payments/demo/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!r.ok) throw new Error(`Payment verification failed: ${await r.text()}`);
  return r.json();
}

export async function fetchCircuitSchema(): Promise<CircuitSchema> {
  const r = await fetch(`${API_BASE}/api/simulations/circuit`);
  if (!r.ok) throw new Error(`Circuit schema fetch failed: ${await r.text()}`);
  return r.json();
}

export async function fetchExperimentHistory(limit: number = 50): Promise<{ experiments: ExperimentHistoryRecord[]; count: number }> {
  const r = await fetch(`${API_BASE}/api/experiments/history?limit=${limit}`);
  if (!r.ok) throw new Error(`History fetch failed: ${r.status}`);
  return r.json();
}

export function getExportUrl(type: 'json' | 'csv' | 'report'): string {
  return `${API_BASE}/api/experiments/export/${type}`;
}
