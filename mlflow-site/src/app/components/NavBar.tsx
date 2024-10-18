'use client';

import Image from 'next/image';
import githubLogo from '../assets/GithubLogo.png';
import linkedInLogo from '../assets/LinkedInLogo.png';

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
        >
          Home
        </button>
        <button
          onClick={() => {
            const element = document.getElementById('features');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
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
          <Image src={githubLogo} width={24} height={24} alt='G' />
        </a>
        <a href='' className='navBarLinksLinkedIn'>
          <Image src={linkedInLogo} width={24} height={24} alt='L' />
        </a>
      </div>
    </div>
  );
};

export default NavBar;
