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
  const demoCardVideos = [
    'https://player.vimeo.com/video/1023585657',
    '',
    '',
  ];
  for (let i = 0; i < 3; i++) {
    demos.push(
      <DemoCard
        key={`demoCard${i}`}
        header={demoCardHeaders[i]}
        blurb={demoCardBlurbs[i]}
        video={demoCardVideos[i]}
      />
    );
  }
  return (
    <div className='demo' id='demo'>{demos}</div>
  );
};

export default Demo;
