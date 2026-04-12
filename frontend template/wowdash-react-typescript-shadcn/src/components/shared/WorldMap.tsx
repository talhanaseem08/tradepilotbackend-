
import WorldMapImage from '@/assets/world-map/world-map.png';

const WorldMap = () => {

  return (
    <div className={`h-full relative w-full flex justify-center items-center`}>
        <img src={WorldMapImage} alt="World Map" className='' />
    </div>
  );
};

export default WorldMap;
