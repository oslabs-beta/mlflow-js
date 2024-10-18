import NavBar from './components/NavBar';
import Team from './components/Team';
import Headline from './components/Headline';
import Features from './components/Features';
import Demo from './components/Demo';

export default function Home() {
  return (
    <div className='wrapper'>
      <div className='mobileWrapper'>
        <NavBar />
        <div className='mobileInnerWrapper'>
          <Headline />
          <Features/>
          <Demo/>
        </div>
        <Team />
      </div>
    </div>
  );
}
