import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User from "../models/User.js";
import generateTokens from "../utils/generateTokens.js";
import bcrypt from "bcrypt";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile._json.email });

        if (!user) {
          const lastSixDigitsID = profile.id.slice(-6);
          const lastTwoDigitsName = profile._json.name.slice(-2);
          const newPass = lastTwoDigitsName + lastSixDigitsID;

          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashedPassword = await bcrypt.hash(newPass, salt);

          user = await User.create({
            name: profile._json.name,
            email: profile._json.email,
            isVerified: true,
            password: hashedPassword,
          });
        }

        const tokens = await generateTokens(user);
        return done(null, { user, ...tokens });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
