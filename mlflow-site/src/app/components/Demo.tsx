import DemoCard from "./DemoCard";

const Demo = () => {
  const demos = [];
  const demoCardHeaders = [
    'Demo 1',
    'Demo 2',
    'Demo 3'
  ];
  const demoCardBlurbs = [
    'Description for what\'s happening in Demo 1.  This block of text will contain all the info needed to understand the demo.',
    'Description for what\'s happening in Demo 2.  This block of text will contain all the info needed to understand the demo.',
    'Description for what\'s happening in Demo 3.  This block of text will contain all the info needed to understand the demo.'
  ];
  for (let i = 0; i < 3; i++) {
    demos.push(
      <DemoCard
        key={`demoCard${i}`}
        header={demoCardHeaders[i]}
        blurb={demoCardBlurbs[i]}
      />
    );
  }
  return (
    <div className='demo text-black bg-white'>{demos}</div>
  );
};

export default Demo;
