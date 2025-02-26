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
  const messageEndRef = useRef(null);
  const hasInitialized = useRef(false);

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState({
    text: '',
    title: '',
  });
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

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
    setMessages(chats.find((chat) => chat.id === activeChat)?.messages || []);
  }, [chats, activeChat]);

  function handleInputValue(e) {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  }

  //初始化chats
  useEffect(() => {
    if (chats.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      createNewChat('New Chat');
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
    setInputValue({ ...inputValue, text: '' });
    const updatedChats = chats.map((chat) => {
      if (activeChat === chat.id) {
        return { ...chat, messages: updatedMessage };
      }
      return chat;
    });

    setChats(updatedChats);
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

        const updatedResponseChats = chats.map((chat) => {
          if (activeChat === chat.id) {
            return { ...chat, messages: updatedResponseMessages };
          }
          return chat;
        });
        setChats(updatedResponseChats);
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

  function createNewChat(text, callback) {
    const newChat = {
      title: text,
      id: uuidv4(),
      time: format(new Date(), 'yyyy/mm/dd HH:mm:ss'),
      messages: [],
    };
    setChats((prevChats) => {
      const updatedChats = [newChat, ...prevChats];
      setActiveChat(newChat.id);
      if (callback) {
        callback;
      }
      return updatedChats;
    });
  }

  function handleEditTitle(id) {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, title: inputValue.title } : chat,
      ),
    );
    setInputValue((prev) => ({ ...prev, title: '' }));
  }

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
        <ChatsToolBar />
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
                <span className="text-2xl font-medium ">{message.text}</span>
                <span className="block text-white">{message.timestamp}</span>
              </div>
            );
          })}
          <div ref={messageEndRef}></div>
        </div>
        {isLoading && (
          <p className="absolute top-[50px] left-[45%]">AI is typing.....</p>
        )}
        <ChatTextInput
          inputValue={inputValue}
          handleInputValue={handleInputValue}
          handleKeyDownText={handleKeyDownText}
          handleSubmitText={handleSubmitText}
        />
      </div>
    </div>
  );
};

export default Chats;
