const GameCard = ({ image, title }) => {
    return (
      <div className="h-[33vh] w-[11.55vw] rounded-xl overflow-hidden shadow-lg transition-transform transform cursor-pointer">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
    );
  };
  
  export default GameCard;