import overallImg from "../assets/overall.png";

export function Hero() {
  return (
    <div className="w-full pt-6">
      <img
        src={overallImg}
        alt="Dar Al Rehan - Perfumes & Attar"
        className="block h-auto w-full"
      />
    </div>
  );
}