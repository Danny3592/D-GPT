import { IoSend } from 'react-icons/io5';
import { MdEmojiEmotions } from 'react-icons/md';

const ChatTextInput = ({
  inputValue,
  handleInputValue,
  handleKeyDownText,
  handleSubmitText,
}) => {
  return (
    <div>
      <div className="bg-amber-200 w-full flex items-center py-5 pr-10 pl-6 ">
        <MdEmojiEmotions className="text-3xl hover:cursor-pointer mr-2" />
        <textarea
          type="text"
          className="bg-[#fff] flex-grow-1 py-3 mx-2 pl-3"
          placeholder="請輸入訊息"
          value={inputValue.text}
          onChange={handleInputValue}
          onKeyDown={handleKeyDownText}
          rows={1}
          name="text"
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
