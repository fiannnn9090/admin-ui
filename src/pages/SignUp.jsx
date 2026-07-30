import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSnackbar from "../components/Elements/AppSnackbar.jsx";
import FormSignUp from "../components/Fragments/FormSignUp.jsx";
import AuthLayout from "../components/Layouts/AuthLayout.jsx";
import { registerService } from "../services/authService.jsx";

function SignUp({ onSignUp, users }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    message: "",
    open: false,
    severity: "success",
  });

  async function handleSubmit(values) {
    const name = String(values.name ?? "").trim();
    const email = String(values.email ?? "").trim().toLowerCase();
    const password = String(values.password ?? "");
    const isEmailUsed = users.some((user) => user.email === email);

    if (isEmailUsed) {
      setErrorMessage("Email already registered.");
      return;
    }

    try {
      setErrorMessage("");
      await registerService({ email, name, password });
      onSignUp({ email, name, password });
      setSnackbar({
        message: "Register Berhasil",
        open: true,
        severity: "success",
      });
      window.setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      const message =
        error?.msg || error?.message || "Email sudah pernah digunakan sebelumnya";

      setErrorMessage(message);
      setSnackbar({
        message,
        open: true,
        severity: "error",
      });
    }
  }

  return (
    <AuthLayout>
      <FormSignUp
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
      />
      <AppSnackbar
        message={snackbar.message}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        open={snackbar.open}
        severity={snackbar.severity}
      />
    </AuthLayout>
  );
}

export default SignUp;
