import ForgotPassword from "@/pages/auth/forgot-password/ForgotPassword";
import Login from "@/pages/auth/login/Login";
import OnboardingProfileQuestion from "@/pages/auth/onboarding/OnboardingProfileQuestion";
import WelcomeOnboarding from "@/pages/auth/onboarding/WelcomeOnboarding";
import Register from "@/pages/auth/register/Register";
import ResetPassword from "@/pages/auth/reset-password/ResetPassword";
import BasicTable from "@/pages/basic-table/BasicTable";
import Calendar from "@/pages/calendar/Calendar";
import ColumnChartPage from "@/pages/chart/column-chart/ColumnChartPage";
import LineChartPage from "@/pages/chart/line-chart/LineChartPage";
import PieChartPage from "@/pages/chart/PieChartPage";
import Chat from "@/pages/chat/Chat";
import Alert from "@/pages/components-pages/alert/Alert";
import Avatar from "@/pages/components-pages/avatar/Avatart";
import Badges from "@/pages/components-pages/badges/Badges";
import Buttons from "@/pages/components-pages/buttons/Buttons";
import CardPage from "@/pages/components-pages/card/CardPage";
import Colors from "@/pages/components-pages/colors/Colors";
import Dropdown from "@/pages/components-pages/dropdown/Dropdown";
import List from "@/pages/components-pages/list/List";
import Pagination from "@/pages/components-pages/pagination/Pagination";
import ProgressBar from "@/pages/components-pages/progress-bar/ProgressBar";
import Radio from "@/pages/components-pages/radio/Radio";
import StarRatings from "@/pages/components-pages/star-ratings/StarRatings";
import SwitchPage from "@/pages/components-pages/switch/SwitchPage";
import TabAccordion from "@/pages/components-pages/tab-accordion/TabAccordion";
import Tags from "@/pages/components-pages/tags/Tags";
import TooltipPopover from "@/pages/components-pages/tooltip-popover/TooltipPopover";
import EmailDetails from "@/pages/emails/email-details/EmailDetails";
import Email from "@/pages/emails/email/Email";
import FormValidation from "@/pages/forms/form-validation/FormValidation";
import InputForms from "@/pages/forms/input-forms/InputForms";
import InputLayout from "@/pages/forms/input-layout/InputLayout";
import Company from "@/pages/setting/company/Company";
import NotificationAlert from "@/pages/setting/notification-alert/NotificationAlert";
import SettingsNotification from "@/pages/setting/settings-notification/SettingsNotification";
import MyBots from "@/pages/my-bots/MyBots";
import UsersGrid from "@/pages/users/users-grid/UsersGrid";
import UsersList from "@/pages/users/UsersList";
import ViewProfile from "@/pages/users/view-profile/ViewProfile";
import Prompt from "@/pages/prompt/Prompt";
import TradeJournal from "@/pages/trade-journal/TradeJournal";
import Analytics from "@/pages/analytics/Analytics";
import AppEntryRedirect from "@/routes/AppEntryRedirect";
import { lazy } from "react";
import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import NotFound from '../error/404';
import RouteErrorBoundary from "../error/RouteErrorBoundary";
import MainLayout from "../layouts/MainLayout";
import Typography from './../pages/components-pages/typography/Typography';
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
            path: "email", element: <Email />
          },
          {
            path: "email-details", element: <EmailDetails />
          },
          {
            path: "chat", element: <Chat />
          },
          {
            path: "calendar", element: <Calendar />
          },
          {
            path: "typography", element: <Typography />
          },
          {
            path: "colors", element: <Colors />
          },
          {
            path: "buttons", element: <Buttons />
          },
          {
            path: "dropdown", element: <Dropdown />
          },
          {
            path: "alert", element: <Alert />
          },
          {
            path: "card", element: <CardPage />
          },
          {
            path: "avatar", element: <Avatar />
          },
          {
            path: "progress-bar", element: <ProgressBar />
          },
          {
            path: "tab-accordion", element: <TabAccordion />
          },
          {
            path: "pagination", element: <Pagination />
          },
          {
            path: "pagination", element: <Pagination />
          },
          {
            path: "badges", element: <Badges />
          },
          {
            path: "tooltip", element: <TooltipPopover />
          },
          {
            path: "star-rating", element: <StarRatings />
          },
          {
            path: "tags", element: <Tags />
          },
          {
            path: "list", element: <List />
          },
          {
            path: "radio", element: <Radio />
          },
          {
            path: "switch", element: <SwitchPage />
          },
          {
            path: "input-forms", element: <InputForms />
          },
          {
            path: "input-layout", element: <InputLayout />
          },
          {
            path: "form-validation", element: <FormValidation />
          },
          {
            path: "line-chart", element: <LineChartPage />
          },
          {
            path: "column-chart", element: <ColumnChartPage />
          },
          {
            path: "pie-chart", element: <PieChartPage />
          },
          {
            path: "basic-table", element: <BasicTable />
          },
          {
            path: "users-list", element: <UsersList />
          },
          {
            path: "users-grid", element: <UsersGrid />
          },
          {
            path: "view-profile", element: <ViewProfile />
          },
          {
            path: "company", element: <Company />
          },
          {
            path: "settings-notification", element: <SettingsNotification />
          },
          {
            path: "notification-alert", element: <NotificationAlert />
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
