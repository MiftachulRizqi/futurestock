export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: {
    full_name?: string;
    store_name?: string;
    email?: string;
    password?: string;
  };
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};