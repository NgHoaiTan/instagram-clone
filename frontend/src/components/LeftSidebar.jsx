import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  {
    icon: <Home />,
    text: "Home",
  },
  {
    icon: <Search />,
    text: "Search",
  },
  {
    icon: <TrendingUp />,
    text: "Explore",
  },
  {
    icon: <MessageCircle />,
    text: "Message",
  },
  {
    icon: <Heart />,
    text: "Notification",
  },
  {
    icon: <PlusSquare />,
    text: "Create",
  },
  {
    icon: (
      <Avatar className="w-6 h-6">
        <AvatarImage src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-1/438223160_1384733812243841_719658860272799040_n.jpg?stp=dst-jpg_p160x160_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGQM8LwkpLAyDXjsa9fp5HxRh7GlXn0ZjZGHsaVefRmNk2sHf--j_6xgNqbkvTVibhI2Q2jQhJQYNkiMlLauAro&_nc_ohc=1WLxonwG6H4Q7kNvgEPPxvt&_nc_oc=Adjh0kVh8x6QaqI8qtqPtSuH_McaeGGZkkQ6FfjX264WCErX1hL3lhdxpc0v5f8aCvJflaDZtF7UH4ZgF5lz3M7u&_nc_zt=24&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=AilahZy8ACcGHpvfm3gWqpB&oh=00_AYF90YjbiU4sLs-dAmbkRP2QclQGes97L5sOM2LCakl46g&oe=67D645F1" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  {
    icon: <LogOut />,
    text: "Logout",
  },
];

const LeftSidebar = () => {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    }
  };
  return (
    <div className="fixed top-0 z-0 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col ">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div className="">
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer p-3 rounded-lg my-3"
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
