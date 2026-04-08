import img from "../../assets/Futuristic landscape with nature and technology.png";
import NavBar1 from "../../components/NavBar1";

export default function LandingPage() {

 

  return (
<>
        <NavBar1/>

    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${img})` }}
    >

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        
      <div className="relative z-10 text-center max-w-3xl px-6">

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-wide">
          HindSight
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
         Your future self is watching every decision you make today - Hindsight makes sure they can see clearly.
        </p>

        
      </div>
    </div>
    </>
  );
}