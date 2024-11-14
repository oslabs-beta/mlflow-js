import DemoCard from "./DemoCard";

const Demo = () => {
  const demos = [];
  const demoCardHeaders = [
    'Manage experiments',
    'Complete workflow',
  ];
  const demoCardBlurbs = [
    'Create experiments with MLflow.js.  Using built-in workflows, manage complex operations easily.',
    'Use MLflow.js to support a full ML project with TensorFlow.js.  Log hyperparameters and key metrics during each training step.  Evaluate model performance and register succesful models.',
  ];
  const demoCardVideos = [
    'https://player.vimeo.com/video/1023585657',
    'https://player.vimeo.com/video/1029068988',
    
  ];
  for (let i = 0; i < 3; i++) {
    demos.push(
      <DemoCard
        key={`demoCard${i}`}
        header={demoCardHeaders[i]}
        blurb={demoCardBlurbs[i]}
        video={demoCardVideos[i]}
      />
    );
  }
  return (
    <div className='demo' id='demo'>{demos}</div>
  );
};

export default Demo;
