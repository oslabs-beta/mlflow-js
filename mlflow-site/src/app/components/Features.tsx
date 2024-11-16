import FeatureCard from "./FeatureCard";

const Features = () => {
  const featureHeader = 'MLOps in Javascript, made simple.';
  const featureLongBlurb = `
    MLflow.js is an open source JavaScript client library, bringing MLflow's powerful capabilities to JavaScript and TypeScript environments. It makes machine learning experimentation and model management intuitive for JavaScript developers through a clean, Promise-based API. Built with TypeScript, it provides comprehensive access to MLflow's REST API while adding streamlined abstractions for common ML workflows. Whether you're tracking experiments with TensorFlow.js, automating retraining pipelines, or managing A/B tests, MLflow.js helps you organize and version everything in one place.

  `;
  const cards = [];
  const featureCardHeaders = [
    'Effortless integration',
    'Streamlined MLOps',
    'For the modern web developer',
    'Dive deeper',
  ];
  const featureCardBlurbs = [
    'Connect your JavaScript stack directly to MLflow with minimal setup.',
    'Automate key MLOps tasks directly from Node.js, simplifying workflow management.  Manage experiments, runs, model registry and model version management with dedicated methods.',
    'Designed specifically for JavaScript developers: no Python knowledge required.',
    'Execute complex MLOps tasks with a single function call with MLflow.js\'s powerful built-in workflows.'

  ];
  for (let i = 0; i < 4; i++) {
    cards.push(
      <FeatureCard
        key={`featureCard${i}`}
        header={featureCardHeaders[i]}
        blurb={featureCardBlurbs[i]}
      />
    );
  }
  return (
    <div className='features' id='features'>
      <div className='featureHeader'>{featureHeader}</div>
      <div className='featureLongBlurb'>{featureLongBlurb}</div>
      <div className='featureCardsSection'>{cards}</div>
    </div>
  );
};

export default Features;
