import MethodRequest from './MethodRequest';

interface MethodIndividualProps {
  name: string;
  description: string;
  requestProps: Array<{ name: string; type: string; description: string }>;
  responseType: string;
  responseDescription: string;
  // github: string;
  // linkedIn: string;
  // pfp: string;
}

const Method: React.FC<MethodIndividualProps> = ({
  name,
  description,
  requestProps,
  responseType,
  responseDescription,
}) => {
  return (
    <div className='method' id={`${name}`}>
      <div className='methodName'>{name}</div>
      <div className='methodDescription'>{description}</div>
      <div>
        <div className='responseStructure'>Request Structure</div>
        <div className='methodRequest mRHeader'>
          <div className='methodRequestLeft textLeftPadding'>Field Name</div>
          <div className='methodRequestMid textLeftPadding'>Type</div>
          <div className='methodRequestRight textLeftPadding'>Description</div>
        </div>
        {requestProps.map((method, index) => (
          <MethodRequest
            key={`methodBarIndividual:${index}`}
            num={index}
            name={method.name}
            type={method.type}
            description={method.description}
          />
        ))}
        <div className='responseStructure'>Response</div>
        <div className='responseFormat responseFormatHeader'>
          <div className='methodRequestLeft textLeftPadding'>Type</div>
          <div className='methodRequestMid textLeftPadding'>Description</div>
        </div>
        <div className='responseFormat methodRequestBG'>
          <div className='methodRequestLeft textLeftPadding'>{responseType}</div>
          <div className='methodRequestMid textLeftPadding'>{responseDescription}</div>
        </div>
      </div>
    </div>
  );
};

export default Method;
