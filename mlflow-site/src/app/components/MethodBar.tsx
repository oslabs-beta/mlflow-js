'use client';

interface MethodBarIndividualProps {
  name: string;
}

const MethodBarIndividual: React.FC<MethodBarIndividualProps> = ({ name }) => {
  return (
    <div
      className='methodBarIndividual'
      onClick={() => {
        const element = document.getElementById(`${name}`);
        element?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      {name}
    </div>
  );
};

export default MethodBarIndividual;
