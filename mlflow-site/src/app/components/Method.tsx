import MethodRequest from './MethodRequest';

interface RequestProps {
  [key: string]: any
}

interface MethodIndividualProps {
  name: string;
  description: string;
  requestProps: RequestProps
  // github: string;
  // linkedIn: string;
  // pfp: string;
}

const Method: React.FC<MethodIndividualProps> = ({
  name,
  description,
  requestProps
}) => {

  // console.log('requestProps: ', requestProps);
  return (
    <div className='method' id={`${name}`}>
      <div className='methodName'>{name}</div>
      <div className='methodDescription'>{description}</div>
      <div className='methodRequest'>
        {/* <MethodRequest key={`methodRequest:${index}`} name={method.name} /> */}
        {/* {requestProps} */}
        {requestProps.map((method, index) => (
          <MethodRequest
            key={`methodBarIndividual:${index}`}
            // property={method}
            name={method.name}
            type={method.type}
            description={method.description}
            // github={member.github}
            // linkedIn={member.linkedIn}
            // pfp={member.pfp}
          />
        ))}
      </div>
      {/* <div>Method Name</div>
      <div>Endpoint/HTTP Method Table</div>
      <div>Method Description</div>
      <div>
        <div>Request Structure</div>
        <div>Table</div>
        <div>Response Structure</div>
        <div>Table</div>
      </div> */}
    </div>
  );
};

export default Method;
