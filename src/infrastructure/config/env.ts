import dotenv from "dotenv";
dotenv.config();

export const env = {
  node_env: process.env.NODE_ENV === "production" ? true : false,
  base_url: process.env.BASE_URL,
  port: process.env.PORT || 5001,
  mongo_uri: process.env.MONGO_URI,
  redis_url: process.env.REDIS_URL,
  otp_ttl_seconds: Number(process.env.OTP_TTL_SECONDS),
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_EMAIL_FROM,
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    access_expires: Math.floor(
      1000 * 60 * Number(process.env.JWT_ACCESS_EXPIRES)
    ),
    refresh_expires: Math.floor(
      1000 * 60 * 60 * 24 * Number(process.env.JWT_REFRESH_EXPIRES)
    ),
  },
};
