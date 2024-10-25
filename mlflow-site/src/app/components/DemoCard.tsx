const DemoCard = ({
  header,
  blurb,
  video
}: {
  key: string;
  blurb: string;
  header: string;
  video: string;
}) => {
  return (
    <div className="demoCard">
      <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
        <iframe
          src={video}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo Video Player"
        />
      </div>
      <div className="demoCardText">
        <div className="demoCardHeader">{header}</div>
        <div className="demoCardInfo">{blurb}</div>
      </div>
    </div>
  );
};

export default DemoCard;
