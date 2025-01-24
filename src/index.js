import React , { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Video from './component/Video';
import AuthWrapper from '../src/component/authWrapper'
import DelayedLazyLoader from './component/DelayedLazy';

const Videos = React.lazy(() => import('./component/Vodeo'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/video',
    element: <AuthWrapper><Video/></AuthWrapper>,
  },
  {
    path: '/vid',
    element:  (<DelayedLazyLoader delay={2000}>
      <AuthWrapper><Videos/></AuthWrapper>
    </DelayedLazyLoader>
        
    )
   ,
  },
]);

// Step 4: Render the RouterProvider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

