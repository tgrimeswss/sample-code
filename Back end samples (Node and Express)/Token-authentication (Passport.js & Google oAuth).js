const keys = require('../../config/keys')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../../models/User')
const uuid = require('uuid')


const googleStrategy = new GoogleStrategy(
  {
    clientID: keys.googleOAuthLoginClientID,
    clientSecret: keys.googleOAuthLoginClientSecret,
    callbackURL: `/auth/google/callback`
  },
  async (accessToken,refreshToken,profile,done)=>{
    const existingUser = await User.findOne({ accountID : profile.id })
    if (existingUser) {return done(null, existingUser)}
    const user = await new User({
      accountType:'google',
      accountID: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
      paymentHistory: [],
      paymentInfo: {},
      courseInfo: [],
      secretKey:uuid()
    }).save()
    done(null,user)
  }
)

module.exports = googleStrategy
