import Logo from "../Elements/Logo.jsx";
import { useColorMode } from "../../context/colorModeContext.jsx";

function AuthLayout({ children, logoClassName = "mb-10" }) {
  const { modeClassName } = useColorMode();

  return (
    <main className={`${modeClassName} flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10`}>
      <section className="w-full max-w-xs">
        <Logo className={logoClassName} />
        {children}
      </section>
    </main>
  );
}

export default AuthLayout;
