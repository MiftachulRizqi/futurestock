import LoginRegisterClient from "./LoginRegisterClient";

type AuthMode = "login" | "register" | "forgot";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{
    mode?: string;
    next?: string;
  }>;
}) {
  const params = await searchParams;

  const modeParam = params?.mode;
  const next = params?.next || "/dashboard";

  const initialMode: AuthMode =
    modeParam === "register" || modeParam === "forgot" ? modeParam : "login";

  return <LoginRegisterClient next={next} initialMode={initialMode} />;
}