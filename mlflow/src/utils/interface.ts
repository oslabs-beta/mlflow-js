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
    metrics: Metrics[];
    params: Params[];
    tags: Tags[];
  };
  inputs: Array<{
    tags?: Tags[];
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

export interface Metrics {
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

export interface MetricHistoryResponse {
  metrics: Metrics[];
  next_page_token?: string;
}
