import crypto from "crypto-js";

export const hashPassword = (password: string) => {
  return crypto.SHA256(password).toString();
};
