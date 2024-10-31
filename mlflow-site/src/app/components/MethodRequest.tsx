'use client';

interface keystring {
    [key: string]: string;
}

const MethodRequest: React.FC<keystring> = ( property ) => {
    console.log('property: ', property);
  return (
    <div className='methodBarIndividual'>
      <div>{property.name}</div>
      <div>{property.type}</div>
      <div>{property.description}</div>
    </div>
  );
};

export default MethodRequest;
