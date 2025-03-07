import { VscRobot } from 'react-icons/vsc';
import { Link } from 'react-router';
const Home = () => {
  return (
    <div className="flex items-center justify-center h-[500px] flex-col">
      <div className="flex items-center gap-10 ">
        <VscRobot className="text-[12rem] md:text-[10rem] text-[#e4a2a2]" />
        <h3
          className="bg-gradient-to-r from-purple-400 via-pink-500  to-red-300 tracking-wider
        bg-clip-text text-transparent text-[3rem] md:text-[5rem] font-bold "
        >
          歡迎使用D-Chat!!
        </h3>
      </div>

      <div className="flex mt-15 md:gap-20 gap-5">
        <Link to="/chats">
          <button className="sub-btn btn">進入聊天室</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
