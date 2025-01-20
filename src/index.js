import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Video from './component/Video';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/video',
    element: <Video/>,
  },
]);

// Step 4: Render the RouterProvider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

