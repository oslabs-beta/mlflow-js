// import React from 'react';
import imageNotFound from '../../assets/imageNotFound.jpg'

interface TeamCardProps {
  name: string;
  github: string;
  email: string;
  linkedIn: string;
}
// declare function require(path: string);
// const kittenHeader = require('../images/kitten-header.jpg');

const TeamCard: React.FC<TeamCardProps> = ({
  name,
  github,
  email,
  linkedIn,
}) => {
  return (
    <div className='teamcard'>
      {/* <div style={{ backgroundImage: 'url(../../assets/imageNotFound.jpg)' }} className='teamCardImg'></div> */}
      <img src={imageNotFound} alt='Miss'></img>
      {/* <img src={require('../../assets/imageNotFound.jpg')} alt="Test"></img> */}
      <div>{name}</div>
      <div>
        <a href={github}>G </a>
        <a href={`mailto:${email}`}>E </a>
        <a href={linkedIn}>L </a>
      </div>
    </div>
  );
};

export default TeamCard;
