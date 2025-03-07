import { createBrowserRouter } from 'react-router';
import MainHeader from '../layout/MainHeader';
import Home from '../pages/Home';
import Chats from '../pages/Chats';

const route = createBrowserRouter([
  {
    path: '/',
    element: <MainHeader />,
    children: [
      { index: true, element: <Home /> },
      { path: '/chats', element: <Chats /> },
    ],
  },
]);

export default route;
