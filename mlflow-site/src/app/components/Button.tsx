'use client';

const Button = () => {
  return (
    <div className='button'>
      <a
        href='https://www.npmjs.com/package/mlflow-js'
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
