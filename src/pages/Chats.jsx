import { useEffect, useState } from 'react';
import { useRef } from 'react';
//Style
import classes from '../assets/Chats.module.css';
//Components
import { CiEdit } from 'react-icons/ci';
import ChatsList from '../components/ChatsList';
import ChatsToolBar from '../components/ChatsToolBar';
import ChatTextInput from '../components/ChatTextInput';

//套件
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const Chats = () => {
  //控制chat-box scroll
  const messageEndRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  //防止StrictMode建立兩個chats
  const hasInitialized = useRef(false);

  //chat-box state
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState({
    text: '',
    title: '',
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  function handleEmojiSelect(emoji) {
    setInputValue((prevInput) => {
      return { ...prevInput, text: prevInput.text + emoji.native };
    });
  }

  const [fontSize, setFontSize] = useState(1);
  const [color, setColor] = useState('#fff');

  //目前標記的chat
  const [activeChat, setActiveChat] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // const chatEndRef = useRef(null);

  //取得localStorage的紀錄

  useEffect(() => {
    console.log('chats updated = ', chats); // ✅ 確保 `chats` 更新後有值
  }, [chats]);
  
  
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem('chats')) || [];
    console.log('storedChats11fqwfqwf1 = ', storedChats);
    setChats(storedChats);
    if (storedChats.length > 0) {
      setActiveChat(storedChats[0].id);
    }
  }, []);

  useEffect(() => {
    if (activeChat) {
      const storeMessages = JSON.parse(localStorage.getItem(activeChat)) || [];
      setMessages(storeMessages);
    }
  }, [activeChat]);

  //==============處理chat box的scroll是否自動往下 START=========
  useEffect(() => {
    const messagesContainer = messageEndRef.current?.parentElement; // 取得 scrollable div
    if (!messagesContainer) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isUserAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      if (!isUserAtBottom) {
        setIsAtBottom(false);
      } else {
        setIsAtBottom(true);
      }
    };
    messagesContainer.addEventListener('scroll', handleScroll);
    return () => messagesContainer.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (isAtBottom) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  //==============處理chat box的scroll是否自動往下 END=========

  //初始化message
  useEffect(() => {
    setMessages(
      (chats.length > 0 &&
        chats.find((chat) => chat.id === activeChat)?.messages) ||
        [],
    );
  }, [chats, activeChat]);

  function handleInputValue(e) {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  }

  //初始化chats
  useEffect(() => {
    if (chats.length === 0 && !hasInitialized.current) {
      createNewChat('New Chat');
      hasInitialized.current = true;
      console.log('pass');
    }
  }, []);

  //初始化activeChat
  useEffect(() => {
    if (chats.length < 1) {
      setActiveChat(null);
    }
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0].id); // 當 activeChat 為 null 時，預設第一個聊天
    }
  }, [activeChat, chats]);

  function handleSubmitText() {
    if (inputValue.text.trim() === '' || isLoading) return;
    const newMessage = {
      role: 'prompt',
      text: inputValue.text,
      timestamp: format(new Date(), 'MM/dd HH:mm:ss'),
    };
    const updatedMessage = [...messages, newMessage];

    setMessages(updatedMessage);

    localStorage.setItem(activeChat, JSON.stringify(updatedMessage));

    setInputValue({ ...inputValue, text: '' });
    const updatedChats = chats.map((chat) => {
      if (activeChat === chat.id) {
        return { ...chat, messages: updatedMessage };
      }
      return chat;
    });

    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    getResponse();

    async function getResponse() {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: inputValue.text }],
              max_tokens: 500,
            }),
          },
        );
        if (!response.ok) {
          throw Error('fail to get response');
        }
        const data = await response.json();
        const chatResponse = data.choices[0].message.content.trim();

        const newResponseMessage = {
          role: 'response',
          text: chatResponse,
          timestamp: format(new Date(), 'MM/dd HH:mm:ss'),
        };
        const updatedResponseMessages = [...updatedMessage, newResponseMessage];
        setMessages(updatedResponseMessages);

        localStorage.setItem(
          'activeChat',
          JSON.stringify(updatedResponseMessages),
        );

        const updatedResponseChats = chats.map((chat) => {
          if (activeChat === chat.id) {
            return { ...chat, messages: updatedResponseMessages };
          }
          return chat;
        });

        setChats(updatedResponseChats);
        localStorage.setItem('chats', JSON.stringify(updatedResponseChats));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handleDeleteChat(id) {
    const updatedChats = chats.filter((chat) => id !== chat.id);
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    localStorage.removeItem(id);

    if (activeChat === id) {
      const newActiveChat = updatedChats.length > 0 ? updatedChats[0].id : null;
      setActiveChat(newActiveChat);
    }
  }

  function handleKeyDownText(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 阻止預設換行行為
      handleSubmitText();
    }
  }

  function createNewChat(text) {
    const newChat = {
      title: text,
      id: uuidv4(),
      time: format(new Date(), 'yyyy/mm/dd HH:mm:ss'),
      messages: [],
    };
    const updatedChats = [newChat, ...chats];

    console.log('updatedChats = ', updatedChats);
    if (hasInitialized.current === true) {
      localStorage.setItem('chats', JSON.stringify(updatedChats));
    }
    localStorage.setItem(newChat.id, JSON.stringify(newChat.messages));

    setChats(updatedChats);
    setActiveChat(newChat.id);
  }

  function handleEditTitle(id) {
    const updatedChats = chats.map((chat) => {
      if (chat.id === id && inputValue.title) {
        return { ...chat, title: inputValue.title };
      }
      return chat;
    });

    setChats(updatedChats)
    localStorage.setItem('chats', JSON.stringify(updatedChats));



    setInputValue((prev) => ({ ...prev, title: '' }));
  }

  const downloadJson = () => {
    const file = chats.find((chat) => chat.id === activeChat);
    const jsonString = JSON.stringify(file, null, 2); // 轉換成 JSON 格式
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json'; // 設定下載的檔案名稱
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-150px)] ">
      <div
        className={`${classes['custom-scrollbar']} flex left h-full  w-[500px] mt-5 ml-5 rounded-xl  bg-gradient-to-r from-purple-400
       via-pink-500 to-[#e0a6a6] justify-center h-min-full overflow-scroll`}
      >
        <div className="flex flex-col justify-start w-[80%] gap-3 px-1 pt-5">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">Chats</span>
            <CiEdit
              className="text-3xl font-bold hover:cursor-pointer"
              onClick={() => createNewChat('New Chat')}
              title="新增對話聊天室"
            />
          </div>
          <ChatsList
            chats={chats}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            handleDeleteChat={handleDeleteChat}
            isEditingTitle={isEditingTitle}
            handleInputValue={handleInputValue}
            handleEditTitle={handleEditTitle}
            inputValue={inputValue}
            setIsEditingTitle={setIsEditingTitle}
          />
        </div>
      </div>
      <div className="right relative w-[70%] h-full bg-[#94dbe2b7] mt-5 mx-5 rounded-md overflow-hidden">
        <ChatsToolBar
          setFontSize={setFontSize}
          fontSize={fontSize}
          setColor={setColor}
          color={color}
          downloadJson={downloadJson}
        />
        <div
          className={`${classes['custom-scrollbar']} flex flex-col gap-3 p-5 overflow-y-auto h-[calc(100%-170px)]`}
        >
          {messages?.map((message, index) => {
            return (
              <div
                className={`${
                  message.role === 'prompt' ? 'prompt' : 'response'
                }`}
                key={message.timestamp + index}
              >
                <span
                  className={`text-${fontSize}xl font-medium`}
                  style={{ color: color }}
                >
                  {message.text}
                </span>
                <span className="block text-white">{message.timestamp}</span>
              </div>
            );
          })}
          <div ref={messageEndRef}></div>
        </div>
        {isLoading && (
          <p className="absolute top-[20px] left-[45%] text-3xl bg-[#e50b0b] px-5 py-2 rounded-md">
            AI is typing.....
          </p>
        )}
        <ChatTextInput
          inputValue={inputValue}
          handleInputValue={handleInputValue}
          handleKeyDownText={handleKeyDownText}
          handleSubmitText={handleSubmitText}
          handleEmojiSelect={handleEmojiSelect}
          setShowEmojiPicker={setShowEmojiPicker}
          showEmojiPicker={showEmojiPicker}
        />
      </div>
    </div>
  );
};

export default Chats;
