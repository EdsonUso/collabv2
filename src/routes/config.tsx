import { createBrowserRouter } from "react-router-dom"
import { PATHS } from "./paths"
import { GuestRoute } from "./GuestRoute"
import { PrivateRoute } from "./PrivateRoute"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import HomePage from "@/pages/HomePage"
import OAuthCallbackPage from "@/pages/OAuthCallbackPage"

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <HomePage />,
  },

  {
    path: PATHS.OAUTH_CALLBACK,
    element: <OAuthCallbackPage />,
  },

  {
    element: <GuestRoute />,
    children: [
      {
        path: PATHS.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PATHS.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },

  {
    element: <PrivateRoute />,
    children: [],
  },
])
