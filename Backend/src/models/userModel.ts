import mongoose, { Schema, Document } from 'mongoose';

const userModel = new Schema({
   first_name: {
      type: String,
      required: true
   },
   last_name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   mobile: {
      type: String,
      required: true
   },
   date_of_birth: String,
   role: {
      type: String,
      required: true
   },
   date_of_joining: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   gender: {
      type: String,
      required: true
   },
   emp_code: {
      type: String,
      required: true,
      unique: true
   },

})
const userSchema = mongoose.model('Users', userModel);
export default userSchema;
