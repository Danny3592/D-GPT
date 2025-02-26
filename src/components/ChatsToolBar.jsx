
import { FaLongArrowAltRight } from 'react-icons/fa';
import { FaFont, FaShareNodes } from 'react-icons/fa6';
import { IoIosColorPalette } from 'react-icons/io';

const ChatsToolBar = () => {
  return (
    <div className="h-[80px] bg-amber-200 flex items-center justify-between pl-5 pr-5 gap-5">
      <div className="flex gap-5 ">
        <FaShareNodes className="text-3xl hover:cursor-pointer" />
        <FaFont className="text-3xl hover:cursor-pointer" />
        <IoIosColorPalette className="text-3xl hover:cursor-pointer" />
      </div>
      <FaLongArrowAltRight className="text-3xl hover:cursor-pointer" />
    </div>
  );
};

export default ChatsToolBar;
