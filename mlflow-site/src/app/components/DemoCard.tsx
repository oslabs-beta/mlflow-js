import Image from "next/image";

const DemoCard = ({ header, blurb }: {
    key: string,
    blurb: string,
    header: string
  }) => {
    return (
      <div className='demoCard gap-5 p-1 mb-2 text-center'>
        <Image
            src='https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW9tcWttZ3R0YTVpNWxwcGJ4M2YyZ2ExcmxlazN5N3JyenF0ajl4dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FqdGGgugkC4Xm/giphy.gif'
            alt=''
            width={700}
            height={475}
            sizes="100vw"
            style={{
                width: "100%",
                height: "auto",
            }}
        />
        <div className='text-2xl'>{header}</div>
        {blurb}
      </div>
    );
  };
  
  export default DemoCard;
  