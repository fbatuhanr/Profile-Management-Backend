const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// import mongoose from 'mongoose';
// const { Schema } = mongoose;

const userProfileSchema = new Schema({
  email:  String 
});

const userProfile = mongoose.model('userProfile', userProfileSchema);
module.exports = userProfile;