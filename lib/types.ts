export type Status = 'up' | 'down' | 'degraded' | 'paused';
export type Range = '24h' | '7d' | '30d';
export type PlanKey = 'starter' | 'pro' | 'business';
export interface Monitor {
  id: string; name: string; url: string; method: 'GET' | 'POST' | 'HEAD'; expected: number; interval: number;
  assertKind: 'none' | 'keyword' | 'json'; assertValue: string; paused: boolean;
  slackUrl: string; slackOn: boolean; emails: string; emailOn: boolean;
  isUp: boolean; sslDays: number; issuer: string; lastMs: number; baseMs: number; lastChecked: number;
}
export interface Check { t: number; ms: number; up: boolean; code: number }
export interface Incident { id: string; monitorId: string; start: number; end?: number; cause: string }
export type NewMonitor = Pick<Monitor, 'name' | 'url'> & Partial<Monitor>;