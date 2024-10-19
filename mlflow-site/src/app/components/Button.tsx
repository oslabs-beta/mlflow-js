'use client';

const Button = () => {
  return (
    <div className='button'>
      <button
        onClick={() => {
          window.location.assign('https://github.com/oslabs-beta/mlflow-js');
        }}
        className='homeButton homeButtonDownload text-white'
      >
        Download
      </button>
      <button
        onClick={() => {
          window.location.assign('https://github.com/oslabs-beta/mlflow-js/tree/dev/mlflow/docs');
        }}
        className='homeButton homeButtonRead'
      >
        Read the Docs
      </button>
    </div>
  );
};

export default Button;
