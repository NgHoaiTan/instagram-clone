import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const sendMessageHandler = async () => {
    alert(text);
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-1/438223160_1384733812243841_719658860272799040_n.jpg?stp=dst-jpg_p160x160_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGQM8LwkpLAyDXjsa9fp5HxRh7GlXn0ZjZGHsaVefRmNk2sHf--j_6xgNqbkvTVibhI2Q2jQhJQYNkiMlLauAro&_nc_ohc=1WLxonwG6H4Q7kNvgEPPxvt&_nc_oc=Adjh0kVh8x6QaqI8qtqPtSuH_McaeGGZkkQ6FfjX264WCErX1hL3lhdxpc0v5f8aCvJflaDZtF7UH4ZgF5lz3M7u&_nc_zt=24&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=AilahZy8ACcGHpvfm3gWqpB&oh=00_AYF90YjbiU4sLs-dAmbkRP2QclQGes97L5sOM2LCakl46g&oe=67D645F1"
              alt="comment_image"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>HT</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-us">username</Link>
                  {/* {<span className="text-gray-600 text-sm">Bio here...</span>} */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full font-bold">
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              comments ayenge
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  onChange={changeEventHandler}
                  value={text}
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full outline-none border border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
