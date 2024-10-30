export interface Run {
  info: {
    run_id: string;
    run_name: string;
    experiment_id: string;
    status: string;
    start_time: number;
    end_time: number;
    artifact_uri: string;
    lifecycle_stage: string;
  };
  data: {
    metrics: Array<{ key: string; value: number }>;
    params: Array<{ key: string; value: string }>;
    tags: Array<{ key: string; value: string }>;
  };
  inputs: Array<{
    tags?: Array<{ key: string; value: string }>;
    dataset: {
      name: string;
      digest: string;
      source_type: string;
      source: string;
      schema?: string;
      profile?: string;
    };
  }>;
}

export interface Metric {
  key: string;
  value: number;
  timestamp: number;
}

export interface Params {
  key: string;
  value: string;
}

export interface Tags {
  key: string;
  value: string;
}
