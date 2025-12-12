import { useCallback, useState } from "react";
import { verifyEmail } from "./verifyEmail";

export default function useVerifyEmail(initialError = "") {
  const [emailError, setEmailError] = useState(initialError);

  const validateEmail = useCallback((email: string) => {
    const err = verifyEmail(email);
    setEmailError(err);
    return err === ""; // still return boolean for convenience
  }, []);

  return { emailError, validateEmail, setEmailError };
}
