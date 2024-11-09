'use client';

const Button = () => {
  return (
    <div className='button'>
      <a
        href='https://github.com/oslabs-beta/mlflow-js'
        // className='homeButton homeButtonDownload text-white'
      >
        <button className='homeButton homeButtonDownload text-white'>Download</button>
      </a>
      <a
        href='/documentation'
        // className='homeButton homeButtonRead'
      >
        <button className='homeButton homeButtonRead'>Read the Docs</button>
      </a>
    </div>
  );
};

export default Button;
