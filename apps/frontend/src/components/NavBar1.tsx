import { useNavigate } from "react-router-dom";
const NavBar1= () => {
    const navigate=useNavigate();
  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-800 bg-black">
      
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Hind<span className="text-indigo-500">sight</span>
      </h1>

      <div className="flex items-center gap-4">
        <button  onClick={()=>{navigate('/login')}}className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
          Login
        </button>
        <button onClick={()=>{navigate('/signup')}} className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Sign Up
        </button>
      </div>

    </nav>
  );
};

export default NavBar1;