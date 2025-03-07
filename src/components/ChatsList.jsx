import React from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { MdOutlineEdit } from 'react-icons/md';

const ChatsList = ({
  chats,
  activeChat,
  setActiveChat,
  handleDeleteChat,
  isEditingTitle,
  handleInputValue,
  handleEditTitle,
  inputValue,
  setIsEditingTitle,
}) => {
  return (
    <div>
      {chats.length > 0 &&
        chats.map((chat) => {
          return (
            <div
              key={chat.id}
              className={`${
                chat.id === activeChat
                  ? 'bg-[linear-gradient(to_right,transparent_0%,#eee_15%,transparent_100%)]'
                  : ''
              }  flex w-full px-2 py-2 rounded-md items-center 
                    justify-between hover:bg-[linear-gradient(to_right,transparent_0%,#eee_15%,transparent_100%)]
                     hover:cursor-pointer`}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="flex flex-col">
                <div className="flex gap-3">
                  {isEditingTitle && activeChat === chat.id ? (
                    <input
                      type="text"
                      value={inputValue?.title}
                      onChange={handleInputValue}
                      name="title"
                      className="text-2xl border"
                      maxLength={15}
                    />
                  ) : (
                    <span className="text-2xl mb-3">{chat.title}</span>
                  )}

                  <MdOutlineEdit
                    className="text-2xl  hover:bg-amber-800"
                    onClick={() => {
                      setIsEditingTitle((prev) => !prev);
                      handleEditTitle(chat.id);
                    }}
                  />
                </div>

                <span className="text-md">{chat.time}</span>
              </div>
              <IoMdCloseCircleOutline
                className="text-3xl hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
              />
            </div>
          );
        })}
    </div>
  );
};

export default ChatsList;
