import { useEffect, useState ,useRef} from 'react';

import { FaLongArrowAltRight } from 'react-icons/fa';
import { FaFont, FaShareNodes } from 'react-icons/fa6';
import { IoIosColorPalette } from 'react-icons/io';
import { SketchPicker } from 'react-color';

import { Link } from 'react-router';

import { useClickAway } from 'react-use'; // 新增的 Hook


const ChatsToolBar = ({
  setFontSize,
  fontSize,
  setColor,
  color,
  downloadJson,
}) => {

  const pickerRef = useRef(null); // 建立 Ref 來追蹤顏色選擇器



  const [colorPickerIsOpen, setColorPickerIsOpen] = useState(false);



  useClickAway(pickerRef, () => setColorPickerIsOpen(false)); // 監聽點擊外部

  return (
    <div className="h-[80px] bg-amber-200 flex items-center justify-between pl-5 pr-5 gap-5">
      <div className="flex gap-5 ">
        <FaShareNodes
          className="text-3xl hover:cursor-pointer"
          onClick={downloadJson}
          title="下載對話紀錄"
        />
        <FaFont
          className="text-3xl hover:cursor-pointer"
          title="選擇對話字體大小"
          onClick={() => {
            if (fontSize === 3) {
              setFontSize(1);
              return;
            }
            const newFz = fontSize + 1;
            setFontSize(newFz);
          }}
        />
        <IoIosColorPalette
          className="text-3xl hover:cursor-pointer"
          onClick={() => setColorPickerIsOpen((prev) => !prev)}
          title="選擇對話字體顏色"
        />
        {colorPickerIsOpen && (
          <div
            tabIndex={0}
            ref={pickerRef}
          >
            <SketchPicker
              color={color}
              className="absolute top-[50px] left-[150px]"
              onChange={(updatedColor) => setColor(updatedColor.hex)}
            />
            <p>選擇的顏色: {color}</p>
          </div>
        )}
      </div>
      <Link to="/">
        <FaLongArrowAltRight className="text-3xl hover:cursor-pointer" />
      </Link>
    </div>
  );
};

export default ChatsToolBar;
