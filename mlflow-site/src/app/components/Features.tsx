import FeatureCard from "./FeatureCard";

const Features = () => {
  const featureHeader = 'MLOps in Javascript, made simple.';
  const featureLongBlurb = `
    Longer blurb about MLFlow.js\'s feature set.  Longer blurb about MLFlow.js\'s feature set.  Longer blurb about MLFlow.js\'s feature set.  Longer blurb about MLFlow.js\'s feature set.  Longer blurb about MLFlow.js\'s feature set.  Longer blurb about MLFlow.js\'s feature set.  
  `;
  const cards = [];
  const featureCardHeaders = [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4',
  ];
  const featureCardBlurbs = [
    'Feature Card Blurb 1.  Feature Card Blurb 1.  Feature Card Blurb 1.  Feature Card Blurb 1.  ',
    'Feature Card Blurb 2.  Feature Card Blurb 2.  Feature Card Blurb 2.  Feature Card Blurb 2.  ',
    'Feature Card Blurb 3.  Feature Card Blurb 3.  Feature Card Blurb 3.  Feature Card Blurb 3.  ',
    'Feature Card Blurb 4.  Feature Card Blurb 4.  Feature Card Blurb 4.  Feature Card Blurb 4.  '

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
    <div className='features p-2 mb-20 text-center text-black bg-white'>
      <div className='text-3xl mb-2'>{featureHeader}</div>
      <div className='mb-2'>{featureLongBlurb}</div>
      <div className=''>{cards}</div>
    </div>
  );
};

export default Features;
