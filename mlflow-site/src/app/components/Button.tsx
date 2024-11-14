'use client';

const Button = () => {
  return (
    <div className='button'>
      <a
        href='https://github.com/oslabs-beta/mlflow-js'
      >
        <button className='homeButton homeButtonDownload text-white'>Download</button>
      </a>
      <a
        href='/documentation'
      >
        <button className='homeButton homeButtonRead'>Read the Docs</button>
      </a>
    </div>
  );
};

export default Button;
