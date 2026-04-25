import { Outlet } from "react-router-dom";
import NavBar2 from "../../components/NavBar2";

export default function DashBoard() {
  return (
    <div className="min-h-screen bg-[#0c0c10] flex flex-col">
      <div className="fixed top-0 left-0 w-2/3 h-3/4 bg-amber-950/10 rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/3 pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-1/2 h-2/3 bg-indigo-950/10 rounded-full blur-[100px] translate-x-1/4 translate-y-1/3 pointer-events-none z-0" />

      <div className="relative z-50">
        <NavBar2 />
      </div>

      <main className="relative z-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
