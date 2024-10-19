import TeamCard from './TeamCard';

const Team = () => {
  const teamArray = [
    {
      name: 'Yiqun Zheng',
      github: 'https://github.com/yiqunzheng',
      linkedIn: 'https://www.linkedin.com/in/yiqunzheng/',
      pfp: '',
    },
    {
      name: 'Kyler Chiago',
      github: 'https://github.com/Kyler-Chiago',
      linkedIn: 'https://www.linkedin.com/in/kyler-chiago/',
      pfp: '/assets/kylerpfp.png',
    },
    {
      name: 'Austin Fraser',
      github: 'https://github.com/austinbfraser',
      linkedIn: 'http://www.linkedin.com/in/austin-fraser',
      pfp: '',
    },
    {
      name: 'Stephany Ho',
      github: 'https://github.com/seneyu/',
      linkedIn: 'https://www.linkedin.com/in/stephanyho/',
      pfp: '',
    },
  ];
  
  return (
    <div className='team' id='team'>
      <div className='centered teamHead'>Meet the team</div>
      <div className='teamCards'>
        {teamArray.map((member, index) => (
          <TeamCard 
            key={index} 
            name={member.name} 
            github={member.github} 
            linkedIn={member.linkedIn} 
            pfp={member.pfp}
          />
        ))}
      </div>
      <TeamCard 
      key={'soloCard'}
      name={'Winston Ludlam'}
      github={'https://github.com/winjolu/'}
      linkedIn={'https://www.linkedin.com/in/wjludlam/'}
      pfp={''}
      />
    </div>
  );
};

export default Team;

