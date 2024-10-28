'use client';

import Image from 'next/image';

const NavBar = () => {
  return (
    <div className='navBar'>
      <div className='navBarMlflow'>MLflow.js</div>
      <div className='navBarLinks'>
        <button
          onClick={() => {
            const element = document.getElementById('headline');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className='navBarLinksHome'
        >
          Home
        </button>
        <button
          onClick={() => {
            const element = document.getElementById('features');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className='navBarLinksFeatures'
        >
          Features
        </button>
        <button
          onClick={() => {
            const element = document.getElementById('demo');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className='navBarLinksDemo'
        >
          Demo
        </button>
        <button
          onClick={() => {
            const element = document.getElementById('team');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className='navBarLinksTeam'
        >
          Team
        </button>
        <a
          href='https://github.com/oslabs-beta/mlflow-js'
          className='navBarLinksGithub'
        >
          <Image src={'/assets/GithubLogo.png'} width={24} height={24} alt='G' className='navbarGithub'/>
        </a>
      </div>
    </div>
  );
};

export default NavBar;
