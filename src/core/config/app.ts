export const APP_CONFIG = {
  appName: Bun.env.APP_NAME || "",
  appVersion: Bun.env.APP_VERSION || "",
  appDescription: Bun.env.APP_DESCRIPTION || "",
  appEnv: Bun.env.APP_ENV || "",
  appPort: Bun.env.APP_PORT || 3000,
  db: {
    fileName: Bun.env.DB_FILE_NAME || "",
  },
  jwt: {
    secret: Bun.env.JWT_SECRET || "",
    expiresIn: Bun.env.JWT_EXPIRES_IN || "",
  },
  static: {
    location: Bun.env.STATIC_FILE_LOCATION || "./",
  },
};

console.log(APP_CONFIG);
