import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router'

import App from './App.tsx';
import Auth from './pages/Auth.tsx';
import Profile from './pages/Profile.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    Component: ProtectedRoute,
    children: [
      { path: '/', Component: App },
      { path: '/profile', Component: Profile }
    ]
  },
  { path: '/auth', Component: Auth },
  { path: '*', Component: ErrorPage}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)