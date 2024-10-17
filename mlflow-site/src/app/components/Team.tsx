import TeamCard from './TeamCard';

const Team = () => {
  const teamArray = [
    {
      name: 'Yiqun Zheng',
      github: 'https://github.com/yiqunzheng',
      email: 'yiqun.zhengfamily@gmail.com',
      linkedIn: 'https://www.linkedin.com/in/yiqunzheng/',
    },
    {
      name: 'Kyler Chiago',
      github: 'https://github.com/Kyler-Chiago',
      email: 'kchiago50@gmail.com',
      linkedIn: 'https://www.linkedin.com/in/kyler-chiago/',
    },
    {
      name: 'Austin Fraser',
      github: 'https://github.com/austinbfraser',
      email: 'austinbfraser@gmail.com',
      linkedIn: 'http://www.linkedin.com/in/austin-fraser',
    },
    {
      name: 'Stephany Ho',
      github: 'https://github.com/seneyu/',
      email: 'shohk39@gmail.com',
      linkedIn: 'https://www.linkedin.com/in/stephanyho/',
    },
    {
      name: 'Winston Ludlam',
      github: 'https://github.com/winjolu/',
      email: 'winjolu@gmail.com',
      linkedIn: 'https://www.linkedin.com/in/wjludlam/',
    },
  ];
  
  return (
    <div className='team'>
      <div className='centered'>Meet the team</div>
      <div className='teamCards'>
        {teamArray.map((member, index) => (
          <TeamCard 
            key={index} 
            name={member.name} 
            github={member.github} 
            email={member.email} 
            linkedIn={member.linkedIn} 
          />
        ))}
      </div>
    </div>
  );
};

export default Team;

