import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const createPassword = (str: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(str, salt);
  return hash;
};

export const validatePassword = (str: string, hash: string) => {
  const isMatch = bcrypt.compareSync(str, hash);
  return isMatch;
};

export const createToken = (
  data: string | object | Buffer,
  secret: string,
  validity: string | number,
) => {
  return jwt.sign(data, secret, {
    expiresIn: validity as any,
  });
};

export const validateToken = (token: string, secret: string) => {
  try {
    const verified = jwt.verify(token, secret);
    return verified;
  } catch (err: any) {
    throw new Error("invalid token");
  }
};
