import Image from 'next/image';

interface TeamCardProps {
  name: string;
  github: string;
  linkedIn: string;
  pfp: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, github, linkedIn, pfp }) => {
  return (
    <div className='teamcard'>
      <Image src={pfp} width={80} height={80} alt='No Image' className='teamCardImg'/>
      <div>{name}</div>
      <div className='teamcardLinks'>
        <a href={github} className='teamCardLink1'>
          <Image className='navbarGithub'
            src={'/assets/GithubLogo.png'}
            width={20}
            height={20}
            alt='G'
          />
        </a>
        <a href={linkedIn} className='teamCardLink2'>
          <Image className='navbarGithub'
            src={'/assets/LinkedInLogo.png'}
            width={20}
            height={20}
            alt='L'
          />
        </a>
      </div>
    </div>
  );
};

export default TeamCard;
