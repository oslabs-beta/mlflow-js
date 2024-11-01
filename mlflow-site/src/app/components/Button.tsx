'use client';

const Button = () => {
  return (
    <div className='button'>
      <a
        href='https://github.com/oslabs-beta/mlflow-js'
        className='homeButton homeButtonDownload text-white'
      >
        Download
      </a>
      <a
        href='/documentation'
        className='homeButton homeButtonRead'
      >
        Read the Docs
      </a>
    </div>
  );
};

export default Button;
