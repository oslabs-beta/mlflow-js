// import type { Metadata } from "next";
// import localFont from "next/font/local";
import './documentation.css';
// import { Viewport } from "next";
import Method from '../components/Method';

export default function Documentation() {
  return (
    <div className='documentationWrapper'>
      <div className='documentationHeader'>mlflow</div>
      <div className='documentationLeftSideBar'>
        <div>Methods</div>
        {/* <div>Left SideBar 770px seems to be when the mlflow site hides/shows the left sidebar</div>
        <div>Left SideBar Open/close on click, the left side bar is like 300px wide on teh mlflow site</div> */}
      </div>
      <div className='documentationMain'>
        <div>Main Contents</div>
        <Method />
      </div>
    </div>
  );
}
