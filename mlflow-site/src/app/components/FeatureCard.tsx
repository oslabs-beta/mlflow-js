const FeatureCard = ({ header, blurb }: {
  key: string,
  blurb: string,
  header: string
}) => {
  return (
    <div className='featureCard'>
      <div className='featureCardHeader'>{header}</div>
      {blurb}
    </div>
  );
};

export default FeatureCard;
