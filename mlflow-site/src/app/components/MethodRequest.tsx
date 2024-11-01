'use client';

interface keystring {
    name: string
    type: string
    description: string
    num: number
}

const MethodRequest: React.FC<keystring> = ( property ) => {
  if (property.num % 2 === 0) {
    return (
      <div className='methodRequest methodRequestBG'>
        <div className='methodRequestLeft textLeftPadding textHorizontalOverflow'>{property.name}</div>
        <div className='methodRequestMid textLeftPadding textHorizontalOverflow'>{property.type}</div>
        <div className='methodRequestRight textLeftPadding textHorizontalOverflow'>{property.description}</div>
      </div>
    );
  } else {
    return (
      <div className='methodRequest'>
        <div className='methodRequestLeft textLeftPadding textHorizontalOverflow'>{property.name}</div>
        <div className='methodRequestMid textLeftPadding textHorizontalOverflow'>{property.type}</div>
        <div className='methodRequestRight textLeftPadding textHorizontalOverflow'>{property.description}</div>
      </div>
    );
  };
  }

export default MethodRequest;
