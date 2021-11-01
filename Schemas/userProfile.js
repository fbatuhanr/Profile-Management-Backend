const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// import mongoose from 'mongoose';
// const { Schema } = mongoose;

const userProfileSchema = new Schema({

  email: {type: String},
  password: {type: String},

  name: {type: String},
  surname: {type: String},
  phoneNumber: {type: String},
  education: {type: String},
  country: {type: String},
  state: {type: String},
  hobbies: {type: []}

}, {timestamps: true});

const userProfile = mongoose.model('userProfile', userProfileSchema);
module.exports = userProfile;