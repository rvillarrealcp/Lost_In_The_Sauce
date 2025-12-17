import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children || <Outlet />}</main>
    </div>
  );
};

export default Layout;
