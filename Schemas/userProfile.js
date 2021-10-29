const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// import mongoose from 'mongoose';
// const { Schema } = mongoose;

const userProfileSchema = new Schema({
  email:  String 
}, {timestamps: true});

const userProfile = mongoose.model('userProfile', userProfileSchema);
module.exports = userProfile;