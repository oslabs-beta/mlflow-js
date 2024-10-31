'use client';

interface keystring {
    // [key: string]: string | number;
    name: string
    type: string
    description: string
    num: number
}

const MethodRequest: React.FC<keystring> = ( property ) => {
  // console.log('propety.num: ', property.num);
  if (property.num % 2 === 0) {
    return (
      <div className='methodRequest methodRequestBG'>
        <div className='methodRequestLeft textLeftPadding'>{property.name}</div>
        <div className='methodRequestMid textLeftPadding'>{property.type}</div>
        <div className='methodRequestRight textLeftPadding'>{property.description}</div>
      </div>
    );
  } else {
    return (
      <div className='methodRequest'>
        <div className='methodRequestLeft textLeftPadding'>{property.name}</div>
        <div className='methodRequestMid textLeftPadding'>{property.type}</div>
        <div className='methodRequestRight textLeftPadding'>{property.description}</div>
      </div>
    );
  };
  }

export default MethodRequest;
