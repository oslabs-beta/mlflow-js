// import type { Metadata } from "next";
// import localFont from "next/font/local";
import './documentation.css';
// import { Viewport } from "next";
import Method from '../components/Method';
import MethodBarIndividual from '../components/MethodBar';

export default function Documentation() {
  // const methodArr = [
  //   { name: 'Create Experiment' },
  //   { name: 'Search Experiments' },
  //   { name: 'Get Experiment' },
  //   { name: 'Get Experiment By Name' },
  //   { name: 'Delete Experiment' },
  //   { name: 'Restore Experiment' },
  //   {
  //     name: 'Update Experiment',
  //     description: 'Update experiment name.',
  //     requestProps: [
  //       {
  //         name: 'experiment_id',
  //         type: 'STRING',
  //         description: 'ID of the associated experiment. (required)',
  //       },
  //       {
  //         name: 'new_name',
  //         type: 'STRING',
  //         description:
  //           'The experiment’s name is changed to the new name. The new name must be unique. (required)',
  //       },
  //     ],
  //     response: 'Promise<void>',
  //   },
  // ];

  const methodArr = [
    {
      name: 'Create Experiment',
      description: 'Create an experiment with a name. Returns the ID of the newly created experiment.',
      requestProps: [
        {
          name: 'name',
          type: 'STRING',
          description: 'Experiment name. (required)',
        },
        {
          name: 'artifact_location',
          type: 'STRING',
          description: 'Optional location where all artifacts for the experiment are stored.',
        },
        {
          name: 'tags',
          type: 'ARRAY<{key: string, value: string}>',
          description: 'Optional collection of tags to set on the experiment.',
        },
      ],
      response: 'Promise<string>',
    },
    {
      name: 'Search Experiments',
      description: 'Search experiments.',
      requestProps: [
        {
          name: 'filter',
          type: 'STRING',
          description: 'A filter expression over experiment attributes and tags. (required)',
        },
        {
          name: 'max_results',
          type: 'NUMBER',
          description: 'Maximum number of experiments desired. (required)',
        },
        {
          name: 'page_token',
          type: 'STRING',
          description: 'Optional token indicating the page of experiments to fetch.',
        },
        {
          name: 'order_by',
          type: 'ARRAY<STRING>',
          description: 'Optional list of columns for ordering search results.',
        },
        {
          name: 'view_type',
          type: 'STRING',
          description: 'Optional qualifier for type of experiments to be returned.',
        },
      ],
      response: 'Promise<Object>',
    },
    {
      name: 'Get Experiment',
      description: 'Get metadata for an experiment, querying by experiment ID.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
      ],
      response: 'Promise<Object>',
    },
    {
      name: 'Get Experiment By Name',
      description: 'Get metadata for an experiment, querying by experiment name.',
      requestProps: [
        {
          name: 'experiment_name',
          type: 'STRING',
          description: 'Name of the associated experiment. (required)',
        },
      ],
      response: 'Promise<Object>',
    },
    {
      name: 'Delete Experiment',
      description: 'Mark an experiment for deletion.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
      ],
      response: 'Promise<void>',
    },
    {
      name: 'Restore Experiment',
      description: 'Restore an experiment marked for deletion.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
      ],
      response: 'Promise<void>',
    },
    {
      name: 'Update Experiment',
      description: 'Update experiment name.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the associated experiment. (required)',
        },
        {
          name: 'new_name',
          type: 'STRING',
          description: 'The experiment’s name is changed to the new name. The new name must be unique. (required)',
        },
      ],
      response: 'Promise<void>',
    },
    {
      name: 'Set Experiment Tag',
      description: 'Set a tag on an experiment.',
      requestProps: [
        {
          name: 'experiment_id',
          type: 'STRING',
          description: 'ID of the experiment under which to log the tag. (required)',
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
      response: 'Promise<void>',
    },
  ];
  

  return (
    <div className='documentationWrapper'>
      <div className='documentationHeader'>mlflow</div>
      <div className='documentationLeftSideBar'>
        {methodArr.map((method, index) => (
          <MethodBarIndividual 
            key={`methodBarIndividual:${index}`} 
            name={method.name} 
            // github={member.github} 
            // linkedIn={member.linkedIn} 
            // pfp={member.pfp}
          />
        ))}
        {/* <div>Left SideBar 770px seems to be when the mlflow site hides/shows the left sidebar</div>
        <div>Left SideBar Open/close on click, the left side bar is like 300px wide on teh mlflow site</div> */}
      </div>
      <div className='documentationMain'>
        <div>Main Contents</div>
        {methodArr.map((method, index) => (
          <Method 
            key={`methodIndividual:${index}`}
            name={method.name}
            description={method.description}
            requestProps={method.requestProps}
          />
        ))}
        {/* <Method /> */}
      </div>
    </div>
  );
}
