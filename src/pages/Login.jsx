import React from 'react';
import Input from '../components/Input';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
      <form
        action=""
        className="flex flex-col gap-8  bg-[#5788ae] py-15 px-5 md:px-10 rounded-xl"
      >
        <div className="flex flex-col gap-8 items-end">
          <Input label="帳號" name="account" />
          <Input label="密碼" name="password" />
          <Input label="Email" name="email" />
        </div>
        <div className="flex flex-col gap-3 -mb-3">
          <button className="btn main-btn w-full">登入</button>
          <button className="btn main-btn w-full">
            <div className="flex justify-center items-center gap-5">
              <FcGoogle />
              Google登入
            </div>
          </button>
        </div>
        <div className="flex justify-between px-4 text-xl -mb-5">
          <span className="inline-block font-bold hover:cursor-pointer hover:text-[#d99c7f]">
            忘記密碼?
          </span>
          <span className="inline-block font-bold hover:cursor-pointer hover:text-[#d99c7f]">
            註冊
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
