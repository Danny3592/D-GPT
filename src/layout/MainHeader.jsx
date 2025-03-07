import { NavLink, Outlet } from 'react-router';

const MainHeader = () => {
  return (
    <>
      <header className="bg-[#f697ffe3]">
        <nav className='flex justify-between pr-5'>
          <ul className="flex gap-5 ml-5">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-[2rem]  my-5 inline-block font-bold hover:text-[#e74545] ${
                    isActive ? 'text-[#e74545]' : 'text-[#575454]'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chats"
                className={({ isActive }) =>
                  `text-[2rem]  my-5 inline-block font-bold hover:text-[#e74545] ${
                    isActive ? 'text-[#e74545]' : 'text-[#575454]'
                  }`
                }
              >
                Chats
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default MainHeader;
