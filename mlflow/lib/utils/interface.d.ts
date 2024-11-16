export interface Run {
    info: RunInfo;
    data: RunData;
    inputs?: RunInputs;
}
interface RunInfo {
    run_id: string;
    run_name: string;
    experiment_id: string;
    status: 'RUNNING' | 'SCHEDULED' | 'FINISHED' | 'FAILED' | 'KILLED';
    start_time: number;
    end_time: number;
    artifact_uri: string;
    lifecycle_stage: string;
}
interface RunData {
    metrics: Metrics[];
    params: Params[];
    tags: Tags[];
}
interface RunInputs {
    dataset_inputs?: DatasetInput[];
}
interface DatasetInput {
    tags?: Tags[];
    dataset: {
        name: string;
        digest: string;
        source_type: string;
        source: string;
        schema?: string;
        profile?: string;
    };
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
export interface SearchedRuns {
    runs: Run[];
    next_page_token?: string;
}
export interface CleanupRuns {
    deletedRuns: Run[];
    total: number;
    dryRun: boolean;
}
export interface CopyRun {
    originalRunId: string;
    newRunId: string;
    targetExperimentId: string;
}
export interface Experiment {
    experiment_id: string;
    name: string;
    artifact_location: string;
    lifecycle_stage: string;
    last_update_time: string;
    creation_time: string;
}
export {};
