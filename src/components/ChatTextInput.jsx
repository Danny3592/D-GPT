import { IoSend } from 'react-icons/io5';
import { MdEmojiEmotions } from 'react-icons/md';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ChatTextInput = ({
  inputValue,
  handleInputValue,
  handleKeyDownText,
  handleSubmitText,
  handleEmojiSelect,
  setShowEmojiPicker,
  showEmojiPicker,
}) => {
  return (
    <div>
      <div className="bg-amber-200 w-full flex items-center py-5 pr-10 pl-6 ">
        <MdEmojiEmotions
          className="text-3xl hover:cursor-pointer mr-2"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        />
        {showEmojiPicker && (
          <div className="picker absolute bottom-[80px]">
            <Picker data={data} onEmojiSelect={handleEmojiSelect}  />
          </div>
        )}
        <textarea
          type="text"
          className="bg-[#fff] flex-grow-1 py-3 mx-2 pl-3"
          placeholder="請輸入訊息"
          value={inputValue.text}
          onChange={handleInputValue}
          onKeyDown={handleKeyDownText}
          rows={1}
          name="text"
          onFocus={()=>setShowEmojiPicker(false)}
        />
        <IoSend
          className="text-3xl -ml-10 hover:cursor-pointer"
          onClick={handleSubmitText}
        />
      </div>
    </div>
  );
};

export default ChatTextInput;
