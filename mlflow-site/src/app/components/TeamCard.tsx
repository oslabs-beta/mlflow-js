import imageNotFound from '../../assets/imageNotFound.jpg'

interface TeamCardProps {
  name: string;
  github: string;
  linkedIn: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  name,
  github,
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
        <a href={linkedIn}>L </a>
      </div>
    </div>
  );
};

export default TeamCard;
