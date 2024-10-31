'use client'

interface MethodBarIndividualProps {
  name: string;
  // github: string;
  // linkedIn: string;
  // pfp: string;
}

const MethodBarIndividual: React.FC<MethodBarIndividualProps> = ({name}) => {
    return (
      <div className='methodBarIndividual' onClick={() => {
        // console.log(`${name}`)
        const element = document.getElementById(`${name}`);
        element?.scrollIntoView({ behavior: 'smooth' });
      }}>
        {name}
      </div>
    );
  };
  
  export default MethodBarIndividual;