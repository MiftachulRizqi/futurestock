import LoginRegisterClient from "../login/LoginRegisterClient";

export default function RegisterPage() {
  return <LoginRegisterClient next="/dashboard" initialMode="register" />;
}