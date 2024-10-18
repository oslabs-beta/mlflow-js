import Image from 'next/image'

const NavBar = () => {
  return (
    <div className='navBar'>
      <div className='navBarMlflow'>MLflow.js</div>
      <div className='navBarLinks'>
        <div>Home</div>
        <div className='navBarLinksFeatures'>Features</div>
        <div className='navBarLinksDemo'>Demo</div>
        <div className='navBarLinksTeam'>Team</div>
        <a
          href='https://github.com/oslabs-beta/mlflow-js'
          className='navBarLinksGithub'
        >
          {/* <img src='../../assets/Github_logo.png' alt='G'></img> */}
          <Image
          src='/assets/Github_logo.png'
          width={50}
          height={50}
          alt='M'
          />
        </a>
        <a href='' className='navBarLinksLinkedIn'>
          L
        </a>
      </div>
    </div>
  );
};

export default NavBar;
