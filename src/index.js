import React , { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthWrapper from '../src/component/authWrapper'
import DelayedLazyLoader from './component/DelayedLazy';
import AnimationComponent from './component/animation';
import NotFound from './component/NotFound';
import Profile from './component/Profile';

const Videos = React.lazy(() => import('./component/Vodeo'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/video',
    element:  (<DelayedLazyLoader delay={2000}>
      <AuthWrapper><Videos/></AuthWrapper>
    </DelayedLazyLoader>
        )
   ,
  },
  {
    path: '/vi',
    element: <AnimationComponent/>,
  },
  {
    path: '/profile',
    element: <Profile/>,
  },
  {
    path: '*',
    element: <NotFound/>,
  },
]);

// Step 4: Render the RouterProvider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

