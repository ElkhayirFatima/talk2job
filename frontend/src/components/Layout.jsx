import { Outlet } from "react-router-dom";
import Header from "./common/header";
import Footer from "./common/footer";

const Layout = () => {
  return (
    <div className="relative flex min-h-screen flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
