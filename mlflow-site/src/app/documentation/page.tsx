'use client';
import './documentation.css';
import Method from '../components/Method';
import MethodBarIndividual from '../components/MethodBar';
import Image from 'next/image';

export default function Documentation() {
  const experimentClientMethods = [
    {
      name: 'Create Experiment',
      description:
        'Creates an experiment with a name. Returns the ID of the newly created experiment.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Experiment name. (required)',
        },
        {
          name: 'artifact_location',
          type: 'STRING',
          description:
            'Optional location where all artifacts for the experiment are stored.',
        },
        {
          name: 'tags',
          type: 'ARRAY<{key: string, value: string}>',
          description: 'Optional collection of tags to set on the experiment.',
        },
      ],
      responseType: 'Promise<string>',
      responseDescription:
        'Returns the ID of the newly created experiment in an object.',
    },
    {
      name: 'Search Experiments',
      description:
        'Searches experiments using a filter expression over experiment attributes and tags.',
      requestProps: [
        {
          name: 'filter',
          type: 'STRING',
          description:
            'A filter expression over experiment attributes and tags that allows returning a subset of experiments. (required)',
        },
        {
          name: 'max_results',
          type: 'NUMBER',
          description: 'Maximum number of experiments desired. (required)',
        },
        {
          name: 'page_token',
          type: 'STRING',
          description:
            'Optional token indicating the page of experiments to fetch.',
        },
        {
          name: 'order_by',
          type: 'ARRAY<STRING>',
          description: 'Optional list of columns for ordering search results.',
        },
        {
          name: 'view_type',
          type: 'STRING',
          description:
            'Optional qualifier for type of experiments to be returned.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription:
        'Returns object containing an array of experiment objects matching the filter, and optionally a next_page_token that can be used to retrieve the next page of experiments.',
    },
    {
      name: 'Get Experiment',
      description:
        'Gets metadata for an experiment, querying by experiment ID. This method works on deleted experiments.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'Returns object containing the matched experiment.',
    },
    {
      name: 'Get Experiment By Name',
      description:
        'Gets metadata for an experiment, querying by experiment name. This endpoint will return deleted experiments, but prefers the active experiment if an active and deleted experiment share the same name.',
      requestProps: [
        {
          name: 'experiment_name',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'Returns object containing the matched experiment.',
    },
    {
      name: 'Delete Experiment',
      description: 'Marks an experiment for deletion.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Restore Experiment',
      description: 'Restores an experiment marked for deletion.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Update Experiment',
      description: 'Updates experiment name.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
        {
          name: 'new_name',
          type: 'STRING',
          description:
            'The experiment’s name is changed to the new name. The new name must be unique. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Set Experiment Tag',
      description: 'Sets 1 or more tags on an experiment.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description:
            'ID of the experiment under which to log the tag. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'Name of the tag. (required)',
        },
        {
          name: 'value',
          type: 'STRING',
          description: 'String value of the tag being logged. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
  ];

  const runClientMethods = [
    {
      name: 'Create Run',
      description: 'Creates a new run within an experiment.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
        {
          name: 'run_name',
          type: 'STRING',
          description: 'Name of the run.',
        },
        {
          name: 'start_time',
          type: 'NUMBER',
          description:
            'Unix timestamp in milliseconds of when the run started.',
        },
        {
          name: 'tags',
          type: 'ARRAY<{ key: string; value: string }>',
          description: 'Additional metadata for the run.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The newly created run object.',
    },
    {
      name: 'Delete Run',
      description: 'Marks a run for deletion.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run to delete. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Restore Run',
      description: 'Restores a deleted run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run to restore. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Get Run',
      description: 'Gets metadata, metrics, params, and tags for a run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run to fetch. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription:
        'Run metadata (name, start time, etc) and data (metrics, params, and tags).',
    },
    {
      name: 'Update Run',
      description: 'Updates run metadata.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run to update. (required)',
        },
        {
          name: 'status',
          type: 'STRING',
          description: 'Updated status of the run.',
        },
        {
          name: 'end_time',
          type: 'NUMBER',
          description: 'Unix timestamp in milliseconds of when the run ended.',
        },
        {
          name: 'run_name',
          type: 'STRING',
          description: 'Updated name of the run.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'Updated metadata of the run.',
    },
    {
      name: 'Log Metric',
      description: 'Logs a metric for a run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description:
            'ID of the run under which to log the metric. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'Name of the metric. (required)',
        },
        {
          name: 'value',
          type: 'NUMBER',
          description: 'Double value of the metric being logged. (required)',
        },
        {
          name: 'timestamp',
          type: 'NUMBER',
          description:
            'Unix timestamp in milliseconds at the time metric was logged. (required)',
        },
        {
          name: 'step',
          type: 'NUMBER',
          description: 'Step at which to log the metric.',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Log Batch',
      description: 'Logs a batch of metrics, params, and tags for a run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run to log under. (required)',
        },
        {
          name: 'metrics',
          type: 'ARRAY<{ key: string; value: number; timestamp: number; step?: number }>',
          description: 'Metrics to log.',
        },
        {
          name: 'params',
          type: 'ARRAY<{ key: string; value: string }>',
          description: 'Params to log.',
        },
        {
          name: 'tags',
          type: 'ARRAY<{ key: string; value: string }>',
          description: 'Tags to log.',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Log Model',
      description: 'Logs a model.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run to log under. (required)',
        },
        {
          name: 'model_json',
          type: 'STRING',
          description: 'MLmodel file in json format. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Log Inputs',
      description: 'Logs inputs.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run to log under. (required)',
        },
        {
          name: 'datasets',
          type: 'ARRAY<{tags?: { key: string, value: string }[], dataset: {name: string, digest: string, source_type: string, source: string, schema?: string, profile?: string}}>',
          description: 'Dataset inputs. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Set Tag',
      description: 'Sets a tag on a run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run under which to log the tag. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'Name of the tag. (required)',
        },
        {
          name: 'value',
          type: 'STRING',
          description: 'String value of the tag being logged. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Delete Tag',
      description: 'Deletes a tag on a run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description:
            'ID of the run that the tag was logged under. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'Name of the tag. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Log Param',
      description: 'Logs a param used for a run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run under which to log the param. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'Name of the param. (required)',
        },
        {
          name: 'value',
          type: 'STRING',
          description: 'String value of the param being logged. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Get Metric History',
      description:
        'Gets a list of all values for the specified metric for a given run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description:
            'ID of the run from which to fetch metric values. (required)',
        },
        {
          name: 'metric_key',
          type: 'STRING',
          description: 'Name of the metric. (required)',
        },
        {
          name: 'page_token',
          type: 'STRING',
          description: 'Token indicating the page of metric history to fetch.',
        },
        {
          name: 'max_results',
          type: 'NUMBER',
          description:
            'Maximum number of logged instances of a metric for a run to return per call.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription:
        'All logged values for this metric, along with a token that can be used to issue a query for the next page of metric history values. A missing token indicates that no additional metrics are available to fetch.',
    },
    {
      name: 'Search Runs',
      description: 'Searches for runs that satisfy expressions.',
      requestProps: [
        {
          name: 'experiment_ids',
          type: 'ARRAY<STRING>',
          description: 'List of experiment IDs to search over.',
        },
        {
          name: 'filter',
          type: 'STRING',
          description: 'A filter expression over params, metrics, and tags.',
        },
        {
          name: 'run_view_type',
          type: 'STRING',
          description:
            'Whether to display only active, only deleted, or all runs.',
        },
        {
          name: 'max_results',
          type: 'NUMBER',
          description: 'Maximum number of runs desired.',
        },
        {
          name: 'order_by',
          type: 'ARRAY<STRING>',
          description: 'List of columns to be ordered by.',
        },
        {
          name: 'page_token',
          type: 'STRING',
          description:
            'Token that can be used to retrieve the next page of run results.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription:
        'Runs that match the search criteria, along with a token that can be used to issue a query for the next page of search. A missing token indicates that no additional runs are available to fetch.',
    },
    {
      name: 'List Artifacts',
      description: 'Lists artifacts for a run.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'ID of the run whose artifacts to list. (required)',
        },
        {
          name: 'path',
          type: 'STRING',
          description:
            'Filter artifacts matching this path (a relative path from the root artifact directory).',
        },

        {
          name: 'page_token',
          type: 'STRING',
          description:
            'Token indicating the page of artifact results to fetch.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription:
        'Root artifact directory for the run, file location and metadata for artifacts, and a token that can be used to retrieve the next page of artifact results. A missing token indicates that no additional artifacts are available to fetch.',
    },
  ];

  const modelRegistryClientMethods = [
    {
      name: 'Create Registered Model',
      description: 'Creates a new registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the model to register. (required)',
        },
        {
          name: 'tags',
          type: 'ARRAY<{key: string, value: string}>',
          description: 'Optional tags for the model.',
        },
        {
          name: 'description',
          type: 'STRING',
          description: 'Optional description for the model.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The created registered model object.',
    },
    {
      name: 'Get Registered Model',
      description: 'Retrieves a registered model by name.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description:
            'The name of the registered model to retrieve. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The registered model object.',
    },
    {
      name: 'Rename Registered Model',
      description: 'Renames a registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The current name of the registered model. (required)',
        },
        {
          name: 'newName',
          type: 'STRING',
          description: 'The new name for the registered model. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The updated registered model object.',
    },
    {
      name: 'Update Registered Model',
      description: "Updates a registered model's description.",
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the registered model to update. (required)',
        },
        {
          name: 'description',
          type: 'STRING',
          description: 'The new description for the model.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The updated registered model object.',
    },
    {
      name: 'Delete Registered Model',
      description: 'Deletes a registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the registered model to delete. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Get Latest Model Versions',
      description: 'Gets the latest versions of a registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'stages',
          type: 'ARRAY<STRING>',
          description: 'Optional array of stages to filter the versions by.',
        },
      ],
      responseType: 'Promise<Array<object>>',
      responseDescription: 'An array of the latest model versions.',
    },
    {
      name: 'Search Registered Models',
      description: 'Searches for registered models based on filter criteria.',
      requestProps: [
        {
          name: 'filter',
          type: 'STRING',
          description: 'Optional filter string to apply to the search.',
        },
        {
          name: 'maxResults',
          type: 'NUMBER',
          description: 'Optional maximum number of results to return.',
        },
        {
          name: 'orderBy',
          type: 'ARRAY<STRING>',
          description: 'Optional array of fields to order the results by.',
        },
        {
          name: 'pageToken',
          type: 'STRING',
          description: 'Optional token for pagination.',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription:
        'An object containing the search results and pagination information.',
    },
    {
      name: 'Set Registered Model Tag',
      description: 'Sets a tag on a registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'The key of the tag. (required)',
        },
        {
          name: 'value',
          type: 'STRING',
          description: 'The value of the tag. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Delete Registered Model Tag',
      description: 'Deletes a tag from a registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'The key of the tag to delete. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Set Registered Model Alias',
      description:
        'Sets an alias for a specific version of a registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'alias',
          type: 'STRING',
          description: 'The alias to set. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description:
            'The version number to associate with the alias. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Delete Registered Model Alias',
      description: 'Deletes an alias from a registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'alias',
          type: 'STRING',
          description: 'The alias to delete. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Get Model Version By Alias',
      description: 'Retrieves a model version using its alias.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'alias',
          type: 'STRING',
          description: 'The alias of the model version to retrieve. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The model version object.',
    },
  ];

  const modelVersionClientMethods = [
    {
      name: 'Create Model Version',
      description: 'Creates a new version of a model.',
      requestProps: [
        {
          name: 'modelName',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'source',
          type: 'STRING',
          description:
            'The source path where the model artifacts are stored. (required)',
        },
        {
          name: 'run_id',
          type: 'STRING',
          description:
            'The id of the run that generated this version. (optional)',
        },
        {
          name: 'tags',
          type: 'ARRAY',
          description:
            'Tags of key/value pairs for the model version. (optional)',
        },
        {
          name: 'run_link',
          type: 'STRING',
          description:
            'MLflow run link for the run that generated this model version. (optional)',
        },
        {
          name: 'description',
          type: 'STRING',
          description: 'Description of the model version. (optional)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The created model version object.',
    },
    {
      name: 'Get Model Version',
      description: 'Gets the specified version of the model.',
      requestProps: [
        {
          name: 'modelName',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description: 'The version number of the model to fetch. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The model version object.',
    },
    {
      name: 'Update Model Version',
      description: 'Updates a specific model version.',
      requestProps: [
        {
          name: 'modelName',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description: 'The version number of the model to update. (required)',
        },
        {
          name: 'description',
          type: 'STRING',
          description: 'The description of the model version. (optional)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The updated model version object.',
    },
    {
      name: 'Search Model Versions',
      description: 'Searches for model versions based on provided filters.',
      requestProps: [
        {
          name: 'filter',
          type: 'STRING',
          description:
            'The filter criteria for searching model versions. (optional)',
        },
        {
          name: 'maxResults',
          type: 'NUMBER',
          description: 'The maximum number of results to return. (optional)',
        },
        {
          name: 'order_by',
          type: 'ARRAY',
          description: 'List of columns to be ordered by. (optional)',
        },
        {
          name: 'page_token',
          type: 'STRING',
          description:
            'Pagination token to go to the next page based on previous search query. (optional)',
        },
      ],
      responseType: 'Promise<Array<object>>',
      responseDescription:
        'An array of model versions that match the search criteria.',
    },
    {
      name: 'Get Download URI for Model Version Artifacts',
      description: 'Retrieves the download uri for model version artifacts.',
      requestProps: [
        {
          name: 'modelName',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description:
            'The version number of the model to fetch the uri for. (required)',
        },
      ],
      responseType: 'Promise<string>',
      responseDescription:
        'The uri for downloading the model version artifacts.',
    },
    {
      name: 'Transition Model Version Stage',
      description: 'Transitions a model version to a different stage.',
      requestProps: [
        {
          name: 'modelName',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description:
            'The version number of the model to transition. (required)',
        },
        {
          name: 'stage',
          type: 'STRING',
          description:
            'The stage to transition the model version to (e.g., "staging", "production"). (required)',
        },
        {
          name: 'archive_existing_versions',
          type: 'BOOLEAN',
          description:
            'Flag to archive existing versions in that stage. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription:
        'The updated model version object after the stage transition.',
    },
    {
      name: 'Set Model Version Tag',
      description: 'Sets a tag on a specific model version.',
      requestProps: [
        {
          name: 'modelName',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description: 'The version number of the model to tag. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'The key of the tag. (required)',
        },
        {
          name: 'value',
          type: 'STRING',
          description: 'The value of the tag. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Delete Model Version Tag',
      description: 'Deletes a tag from a specific model version.',
      requestProps: [
        {
          name: 'modelName',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description: 'The version number of the model to untag. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'The key of the tag to delete. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Delete Model Version',
      description: 'Deletes a specific model version.',
      requestProps: [
        {
          name: 'modelName',
          type: 'STRING',
          description: 'The name of the registered model. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description: 'The version number of the model to delete. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
  ];
  const experimentManagerMethods = [
    {
      name: 'Run Existing Experiment',
      description:
        'Full workflow of creating, naming, and starting a run under an existing experiment, logging metrics, params, tags, logging the model, and finishing the run.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description:
            'ID of the experiment under which to log the run. (required)',
        },
        {
          name: 'run_name',
          type: 'STRING',
          description: 'Name of the run to be created and run. (optional)',
        },
        {
          name: 'metrics',
          type: 'ARRAY',
          description: 'The metrics to log (up to 1000 metrics). (optional)',
        },
        {
          name: 'params',
          type: 'ARRAY',
          description: 'The params to log (up to 100 params). (optional)',
        },
        {
          name: 'tags',
          type: 'ARRAY',
          description: 'The tags to log (up to 100 tags). (optional)',
        },
        {
          name: 'model',
          type: 'OBJECT',
          description:
            'The ML model data to log to the run, represented as a Javascript object. (optional)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The created run object with updated metadata.',
    },
    {
      name: 'Run New Experiment',
      description:
        'Full workflow of creating, naming, and starting a run under a new experiment, logging metrics, params, tags, logging the model, and finishing the run.',
      requestProps: [
        {
          name: 'experiment_name',
          type: 'STRING',
          description:
            'Name of the experiment under which to log the run. (required)',
        },
        {
          name: 'run_name',
          type: 'STRING',
          description: 'Name of the run to be created and run. (optional)',
        },
        {
          name: 'metrics',
          type: 'ARRAY',
          description: 'The metrics to log (up to 1000 metrics). (optional)',
        },
        {
          name: 'params',
          type: 'ARRAY',
          description: 'The params to log (up to 100 params). (optional)',
        },
        {
          name: 'tags',
          type: 'ARRAY',
          description: 'The tags to log (up to 100 tags). (optional)',
        },
        {
          name: 'model',
          type: 'OBJECT',
          description:
            'The ML model data to log to the run, represented as a Javascript object. (optional)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The created run object with updated metadata.',
    },
    {
      name: 'Experiment Summary',
      description:
        "Returns an array of all the passed-in experiment's runs, sorted according to the passed-in metric.",
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description:
            'The experiment whose runs will be evaluated. (required)',
        },
        {
          name: 'primaryMetric',
          type: 'STRING',
          description:
            'The metric by which the results array will be sorted. (required)',
        },
        {
          name: 'order',
          type: 'STRING or NUMBER',
          description:
            "Sort order for the array: pass in 'DESC' or 1 for descending; 'ASC' or -1 for ascending. (optional)",
        },
      ],
      responseType: 'Promise<Array<object>>',
      responseDescription:
        'An array of run objects belonging to the passed-in experiment ID, sorted according to the primary metric.',
    },
  ];
  const modelManagerMethods = [
    {
      name: 'Create Registered Model With Version',
      description:
        'Creates a new registered model and creates the first version of that model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Name of the registered model. (required)',
        },
        {
          name: 'versionSource',
          type: 'STRING',
          description:
            'URI indicating the location of the model artifacts. (required)',
        },
        {
          name: 'versionRun_id',
          type: 'STRING',
          description:
            'MLflow run ID for correlation, if versionSource was generated by an experiment run in MLflow tracking server. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The updated model version object.',
    },
    {
      name: 'Update Registered Model Description And Tag',
      description: "Updates a registered model's description and tag.",
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Name of the registered model. (required)',
        },
        {
          name: 'tagKey',
          type: 'STRING',
          description: 'Name of the tag. (required)',
        },
        {
          name: 'tagValue',
          type: 'STRING',
          description: 'String value of the tag being logged. (required)',
        },
        {
          name: 'description',
          type: 'STRING',
          description: 'Description of the registered model. (optional)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The updated registered model object.',
    },
    {
      name: 'Update All Latest Model Version',
      description:
        "Updates the latest version of the specified registered model's description and adds a new alias and tag key/value.",
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Name of the registered model. (required)',
        },
        {
          name: 'alias',
          type: 'STRING',
          description: 'Name of the alias. (required)',
        },
        {
          name: 'description',
          type: 'STRING',
          description: 'The description for the model version. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'Name of the tag. (required)',
        },
        {
          name: 'value',
          type: 'STRING',
          description: 'Name of the value of the tag being logged. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The updated model version object.',
    },
    {
      name: 'Set Latest Model Version Tag',
      description:
        'Adds a new tag key/value for the latest version of the specified registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Name of the registered model. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'Name of the tag. (required)',
        },
        {
          name: 'value',
          type: 'STRING',
          description: 'Name of the value of the tag being logged. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Set Latest Model Version Alias',
      description:
        'Adds an alias for the latest version of the specified registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Name of the registered model. (required)',
        },
        {
          name: 'alias',
          type: 'STRING',
          description: 'Name of the alias. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Update Latest Model Version',
      description:
        'Updates the description of the latest version of a registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Name of the registered model. (required)',
        },
        {
          name: 'description',
          type: 'STRING',
          description: 'The description for the model version. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The updated model version object.',
    },
    {
      name: 'Update All Model Version',
      description:
        "Updates the specified version of the specified registered model's description and adds a new alias and tag key/value for that specified version.",
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Name of the registered model. (required)',
        },
        {
          name: 'version',
          type: 'STRING',
          description: 'Model version number. (required)',
        },
        {
          name: 'alias',
          type: 'STRING',
          description: 'Name of the alias. (required)',
        },
        {
          name: 'key',
          type: 'STRING',
          description: 'Name of the tag. (required)',
        },
        {
          name: 'value',
          type: 'STRING',
          description: 'Name of the value of the tag being logged. (required)',
        },
        {
          name: 'description',
          type: 'STRING',
          description: 'The description for the model version. (required)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'The updated model version object.',
    },
    {
      name: 'Delete Latest Model Version',
      description:
        'Deletes the latest version of the specified registered model.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'The model name. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
    {
      name: 'Create Model From Run With Best Metric',
      description:
        'Creates a new model with the specified model name from the run with the best specified metric.',
      requestProps: [
        {
          name: 'experiment_ids',
          type: 'ARRAY',
          description: 'An array containing an experiment id. (required)',
        },
        {
          name: 'filterMetric',
          type: 'STRING',
          description:
            "The name of the metric that we're filtering by. (required)",
        },
        {
          name: 'metricMinOrMax',
          type: 'STRING',
          description:
            'A string specifying if we want the minimum or maximum value of the specified metric. Can be either "min" or "max". (required)',
        },
        {
          name: 'modelName',
          type: 'STRING',
          description:
            'The name of the new model that will be created. (required)',
        },
      ],
      responseType: 'Promise<void>',
      responseDescription: 'No response.',
    },
  ];
  const runManagerMethods = [
    {
      name: 'Cleanup Runs',
      description:
        'Delete runs that do not meet certain criteria and return deleted runs.',
      requestProps: [
        {
          name: 'experiment_ids',
          type: 'ARRAY<STRING>',
          description: 'The IDs of the associated experiments. (required)',
        },
        {
          name: 'query_string',
          type: 'STRING',
          description:
            'SQL-like query string to filter runs to keep. (required)',
        },
        {
          name: 'metric_key',
          type: 'STRING',
          description: 'The metric key for comparison. (required)',
        },
        {
          name: 'dryRun',
          type: 'BOOLEAN',
          description:
            'If true, only simulate the deletion. Defaults to true. (optional)',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'An object of deleted runs.',
    },
    {
      name: 'Copy Run',
      description:
        'Copy run from one experiment to another without artifacts and models. Artifacts and models detail tagged in new run as reference.',
      requestProps: [
        {
          name: 'run_id',
          type: 'STRING',
          description: 'The ID of the run to be copied. (required)',
        },
        {
          name: 'target_experiment_id',
          type: 'STRING',
          description: 'The ID of the target experiment. (required)',
        },
        {
          name: 'run_name',
          type: 'STRING',
          description: 'The name of the new run in target experiment. ',
        },
      ],
      responseType: 'Promise<object>',
      responseDescription: 'An object detail of the copied run.',
    },
  ];

  return (
    <div className='documentationWrapper'>
      <div className='documentationHeader'>
        <a href='/' className='documentationImageLink'>
          <Image
            src={'/assets/MLflow-js-logo.png'}
            width={144}
            height={38.4}
            alt='G'
            className='documentationImage'
          />
        </a>
      </div>
      <div className='documentationLeftSideBar'>
        <div
          className='documentationLeftHeader'
          onClick={() => {
            const element = document.getElementById(`methodsHeader`);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Mlflow.js Methods
        </div>
        <div
          className='documentationLeftHeader2'
          onClick={() => {
            const element = document.getElementById(`experimentClientHeader`);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Experiment Client Methods
        </div>
        {experimentClientMethods.map((method, index) => (
          <MethodBarIndividual
            key={`experimentClientBarIndividual:${index}`}
            name={method.name}
          />
        ))}
        <div
          className='documentationLeftHeader2'
          onClick={() => {
            const element = document.getElementById(`runClientHeader`);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Run Client Methods
        </div>
        {runClientMethods.map((method, index) => (
          <MethodBarIndividual
            key={`runClientBarIndividual:${index}`}
            name={method.name}
          />
        ))}
        <div
          className='documentationLeftHeader2'
          onClick={() => {
            const element = document.getElementById(
              `modelRegistryClientHeader`
            );
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Model Registry Client Methods
        </div>
        {modelRegistryClientMethods.map((method, index) => (
          <MethodBarIndividual
            key={`modelRegistryClientBarIndividual:${index}`}
            name={method.name}
          />
        ))}
        <div
          className='documentationLeftHeader2'
          onClick={() => {
            const element = document.getElementById(`modelVersionClientHeader`);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Model Version Client Methods
        </div>
        {modelVersionClientMethods.map((method, index) => (
          <MethodBarIndividual
            key={`modelVersionClientBarIndividual:${index}`}
            name={method.name}
          />
        ))}
        <div
          className='documentationLeftHeader2'
          onClick={() => {
            const element = document.getElementById(`experimentManagerHeader`);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Experiment Manager Methods
        </div>
        {experimentManagerMethods.map((method, index) => (
          <MethodBarIndividual
            key={`experimentManagerBarIndividual:${index}`}
            name={method.name}
          />
        ))}
        <div
          className='documentationLeftHeader2'
          onClick={() => {
            const element = document.getElementById(`runManagerHeader`);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Run Manager Methods
        </div>
        {runManagerMethods.map((method, index) => (
          <MethodBarIndividual
            key={`runManagerBarIndividual:${index}`}
            name={method.name}
          />
        ))}
        <div
          className='documentationLeftHeader2'
          onClick={() => {
            const element = document.getElementById(`modelManagerHeader`);
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Model Manager Methods
        </div>
        {modelManagerMethods.map((method, index) => (
          <MethodBarIndividual
            key={`modelManagerBarIndividual:${index}`}
            name={method.name}
          />
        ))}
      </div>
      <div className='documentationMainWrapper'>
        <div className='documentationMain'>
          <div className='methodsHeader' id='methodsHeader'>
            Methods
          </div>
          <span className='mlFlowReference'>
            The Mlflow.js library implements a JavaScript interface to
            Mlflow&apos;s functionality by utilizing the official MLflow REST
            API. For detailed information about the underlying API endpoints,
            please refer here (
            <a
              href='https://mlflow.org/docs/latest/rest-api.html'
              className='mlFlowOfficialLink'
            >
              https://mlflow.org/docs/latest/rest-api.html
            </a>
            ).
          </span>
          <div id='experimentClientHeader' className='methodsHeader2'>
            Experiment Client Methods
          </div>
          {experimentClientMethods.map((method, index) => (
            <Method
              key={`experimentClientIndividual:${index}`}
              name={method.name}
              description={method.description}
              requestProps={method.requestProps}
              responseType={method.responseType}
              responseDescription={method.responseDescription}
            />
          ))}
          <div id='runClientHeader' className='methodsHeader2'>
            Run Client Methods
          </div>
          {runClientMethods.map((method, index) => (
            <Method
              key={`runClientIndividual:${index}`}
              name={method.name}
              description={method.description}
              requestProps={method.requestProps}
              responseType={method.responseType}
              responseDescription={method.responseDescription}
            />
          ))}
          <div id='modelRegistryClientHeader' className='methodsHeader2'>
            Model Registry Client Methods
          </div>
          {modelRegistryClientMethods.map((method, index) => (
            <Method
              key={`modelRegistryClientIndividual:${index}`}
              name={method.name}
              description={method.description}
              requestProps={method.requestProps}
              responseType={method.responseType}
              responseDescription={method.responseDescription}
            />
          ))}
          <div id='modelVersionClientHeader' className='methodsHeader2'>
            Model Version Client Methods
          </div>
          {modelVersionClientMethods.map((method, index) => (
            <Method
              key={`modelVersionClientIndividual:${index}`}
              name={method.name}
              description={method.description}
              requestProps={method.requestProps}
              responseType={method.responseType}
              responseDescription={method.responseDescription}
            />
          ))}
          <div id='experimentManagerHeader' className='methodsHeader2'>
            Experiment Manager Methods
          </div>
          {experimentManagerMethods.map((method, index) => (
            <Method
              key={`experimentManagerIndividual:${index}`}
              name={method.name}
              description={method.description}
              requestProps={method.requestProps}
              responseType={method.responseType}
              responseDescription={method.responseDescription}
            />
          ))}
          <div id='runManagerHeader' className='methodsHeader2'>
            Run Manager Methods
          </div>
          {runManagerMethods.map((method, index) => (
            <Method
              key={`runManagerIndividual:${index}`}
              name={method.name}
              description={method.description}
              requestProps={method.requestProps}
              responseType={method.responseType}
              responseDescription={method.responseDescription}
            />
          ))}
          <div id='modelManagerHeader' className='methodsHeader2'>
            Model Manager Methods
          </div>
          {modelManagerMethods.map((method, index) => (
            <Method
              key={`modelManagerIndividual:${index}`}
              name={method.name}
              description={method.description}
              requestProps={method.requestProps}
              responseType={method.responseType}
              responseDescription={method.responseDescription}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
