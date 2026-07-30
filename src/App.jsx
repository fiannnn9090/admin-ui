import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import Balance from "./pages/balance.jsx";
import Dashboard from "./pages/dashboard.jsx";
import ErrorPage, { NotFoundPage } from "./pages/Error.jsx";
import Expenses from "./pages/expenses.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import MenuPage from "./pages/menuPage.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import { useAuth } from "./context/authContext.jsx";
import { getLocalUsers, registerLocalUser } from "./services/localAuthService.jsx";

const legacyPagePaths = {
  login: "/login",
  "sign-up": "/register",
  "forgot-password": "/forgot-password",
  overview: "/",
};

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}

function NotRequireAuth({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate replace to="/" />;
  }

  return children;
}

function RootRoute() {
  const [searchParams] = useSearchParams();
  const legacyPage = searchParams.get("page");

  if (legacyPage) {
    return <Navigate replace to={legacyPagePaths[legacyPage] ?? "/login"} />;
  }

  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

function SignInRoute() {
  return (
    <NotRequireAuth>
      <SignIn />
    </NotRequireAuth>
  );
}

function SignUpRoute() {
  function handleSignUp(newUser) {
    registerLocalUser(newUser);
  }

  return (
    <NotRequireAuth>
      <SignUp onSignUp={handleSignUp} users={getLocalUsers()} />
    </NotRequireAuth>
  );
}

function ForgotPasswordRoute() {
  return (
    <NotRequireAuth>
      <ForgotPassword users={getLocalUsers()} />
    </NotRequireAuth>
  );
}

function DashboardRedirectRoute() {
  return (
    <RequireAuth>
      <Navigate replace to="/" />
    </RequireAuth>
  );
}

function BalanceRoute() {
  return (
    <RequireAuth>
      <Balance />
    </RequireAuth>
  );
}

function ExpensesRoute() {
  return (
    <RequireAuth>
      <Expenses />
    </RequireAuth>
  );
}

function ProtectedMenuRoute({ type }) {
  return (
    <RequireAuth>
      <MenuPage type={type} />
    </RequireAuth>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <SignInRoute />,
  },
  {
    path: "/register",
    element: <SignUpRoute />,
  },
  {
    path: "/sign-up",
    element: <Navigate replace to="/register" />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordRoute />,
  },
  {
    path: "/dashboard",
    element: <DashboardRedirectRoute />,
  },
  {
    path: "/balance",
    element: <BalanceRoute />,
  },
  {
    path: "/expense",
    element: <ExpensesRoute />,
  },
  {
    path: "/expenses",
    element: <ExpensesRoute />,
  },
  {
    path: "/transaction",
    element: <ProtectedMenuRoute type="transaction" />,
  },
  {
    path: "/transactions",
    element: <ProtectedMenuRoute type="transaction" />,
  },
  {
    path: "/bill",
    element: <ProtectedMenuRoute type="bill" />,
  },
  {
    path: "/bills",
    element: <ProtectedMenuRoute type="bill" />,
  },
  {
    path: "/goal",
    element: <ProtectedMenuRoute type="goal" />,
  },
  {
    path: "/goals",
    element: <ProtectedMenuRoute type="goal" />,
  },
  {
    path: "/setting",
    element: <ProtectedMenuRoute type="setting" />,
  },
  {
    path: "/settings",
    element: <ProtectedMenuRoute type="setting" />,
  },
  {
    path: "/balances",
    element: (
      <RequireAuth>
        <Navigate replace to="/balance" />
      </RequireAuth>
    ),
  },
  {
    path: "/overview",
    element: <DashboardRedirectRoute />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
