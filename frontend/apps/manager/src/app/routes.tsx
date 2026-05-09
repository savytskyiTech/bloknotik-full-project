import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { SchedulePage } from "./components/schedule/SchedulePage";
import { UsersPage } from "./components/users/UsersPage";
import { SettingsPage } from "./components/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "schedule", Component: SchedulePage },
      { path: "users", Component: UsersPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
