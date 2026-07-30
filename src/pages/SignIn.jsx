import { useState } from "react";
import FormSignIn from "../components/Fragments/FormSignIn.jsx";
import AuthLayout from "../components/Layouts/AuthLayout.jsx";
import AppSnackbar from "../components/Elements/AppSnackbar.jsx";
import ThemeModeToggle from "../components/Elements/ThemeModeToggle.jsx";
import { loginService } from "../services/authService.jsx";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  createLocalAuthToken,
  findLocalUser,
} from "../services/localAuthService.jsx";

function SignIn({ notice }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    message: "",
    open: false,
    severity: "error",
  });

  async function handleSubmit(email, password) {
    try {
      const data = await loginService(email, password);
      const token = data.refreshToken ?? data.token ?? data.accessToken;

      if (!token) {
        throw { msg: "Token login tidak ditemukan." };
      }

      login(token);
      navigate("/", { replace: true });
    } catch (error) {
      const localUser = findLocalUser(email, password);

      if (localUser) {
        login(createLocalAuthToken(localUser));
        navigate("/", { replace: true });
        return;
      }

      setSnackbar({
        message: error?.msg || "Login gagal",
        open: true,
        severity: "error",
      });
    }
  }

  return (
    <AuthLayout>
      <FormSignIn
        notice={notice}
        onSubmit={handleSubmit}
      />
      <div className="mt-6 flex justify-center">
        <ThemeModeToggle />
      </div>
      <AppSnackbar
        message={snackbar.message}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        open={snackbar.open}
        severity={snackbar.severity}
      />
    </AuthLayout>
  );
}

export default SignIn;
