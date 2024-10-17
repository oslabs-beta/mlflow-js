// import React from 'react';
import imageNotFound from '../../assets/imageNotFound.jpg'

interface TeamCardProps {
  name: string;
  github: string;
  email: string;
  linkedIn: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  name,
  github,
  email,
  linkedIn,
}) => {
  return (
    <div className='teamcard'>
      <img src={imageNotFound} alt='Img not found'></img>
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
