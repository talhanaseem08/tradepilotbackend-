import ForgotPassword from "@/pages/auth/forgot-password/ForgotPassword";
import Login from "@/pages/auth/login/Login";
import OnboardingProfileQuestion from "@/pages/auth/onboarding/OnboardingProfileQuestion";
import WelcomeOnboarding from "@/pages/auth/onboarding/WelcomeOnboarding";
import Register from "@/pages/auth/register/Register";
import ResetPassword from "@/pages/auth/reset-password/ResetPassword";
import Company from "@/pages/setting/company/Company";
import MyBots from "@/pages/my-bots/MyBots";
import Prompt from "@/pages/prompt/Prompt";
import TradeJournal from "@/pages/trade-journal/TradeJournal";
import Analytics from "@/pages/analytics/Analytics";
import AppEntryRedirect from "@/routes/AppEntryRedirect";
import { lazy } from "react";
import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import NotFound from '../error/404';
import RouteErrorBoundary from "../error/RouteErrorBoundary";
import MainLayout from "../layouts/MainLayout";
import GuestRoutes from "./GuestRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
const Finance = lazy(() => import("@/pages/dashboards/finance/Finance"));
const BotBacktest = lazy(() => import("@/pages/backtest/BotBacktest"));
const News = lazy(() => import("@/pages/news/News"));

function LegacyOnboardingQuestionRedirect() {
  const { legacyStep } = useParams()
  const match = legacyStep?.match(/^question-(\d+)$/)

  if (match) {
    return <Navigate to={`/welcome/profile/question/${match[1]}`} replace />
  }

  return <Navigate to="/welcome/profile/question/1" replace />
}

export const router = createBrowserRouter([
  {
    element: <GuestRoutes />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword />,
      },
    ]
  },

  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/app-entry",
        element: <AppEntryRedirect />,
      },
      {
        path: "/prompt",
        element: <Prompt />,
      },
      {
        path: "/welcome",
        element: <WelcomeOnboarding />,
      },
      {
        path: "/welcome/profile/question/:step",
        element: <OnboardingProfileQuestion />,
      },
      {
        path: "/welcome/profile/:legacyStep",
        element: <LegacyOnboardingQuestionRedirect />,
      },
      {
        path: "/",
        element: <MainLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            index: true,
            element: <Navigate to="/app-entry" replace />,
          },
          {
            path: "/dashboard", element: <Finance />
          },
          {
            path: "/my-bots", element: <MyBots />
          },
          {
            path: "trade-journal", element: <TradeJournal />
          },
          {
            path: "analytics", element: <Analytics />
          },
          {
            path: "backtest", element: <BotBacktest />
          },
          {
            path: "news", element: <News />
          },
          {
            path: "settings", element: <Company />
          },
          {
            path: "company", element: <Navigate to="/settings" replace />
          },
        ],
      },
    ]
  },

  {
    path: "*",
    element: <NotFound />,
    errorElement: <RouteErrorBoundary />,
  },
]);
