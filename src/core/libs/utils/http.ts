import { StatusCode } from "hono/utils/http-status";

export const createResponse = (
  status: "success" | "error",
  message: string,
  data?: unknown,
  error?: unknown,
) => {
  return {
    status: status === "error" ? 0 : 1,
    message,
    data,
    error,
  };
};

export const createError = (
  statusCode: StatusCode,
  message: string,
  error?: unknown,
) => {
  return {
    statusCode,
    message,
    error,
  };
};
