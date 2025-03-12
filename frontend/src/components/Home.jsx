import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import Feed from "./Feed";

const Home = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
