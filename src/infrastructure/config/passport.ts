import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GoogleAuthUseCase } from "../../application/use-cases/user/auth/google-auth.js";
import { UserRepository } from "../repositories/user-repository.js";
import { UserModel } from "../db/models/user-model.js";
import { UserMapper } from "../../application/mappers/user/user.js";
import logger from "../../utils/logger.js";

const userRepo = new UserRepository(UserModel);
const userMapper = new UserMapper();

const googleAuthUseCase = new GoogleAuthUseCase(
  userRepo,
  userMapper,
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      logger.debug("google auth api got hit");
      try {
        const result = await googleAuthUseCase.execute(profile);
        done(null, {...result.data, isNewUser: result.isNewUser});
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

export default passport;
