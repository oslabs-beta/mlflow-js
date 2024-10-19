const FeatureCard = ({ header, blurb }: {
  key: string,
  blurb: string,
  header: string
}) => {
  return (
    <div className='featureCard p-1 mb-2'>
      <div className='text-2xl'>{header}</div>
      {blurb}
    </div>
  );
};

export default FeatureCard;
