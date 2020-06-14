var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  shortUrls: [{ type: Schema.Types.ObjectId, ref: 'ShortUrl', required: false }],
});

// hashing a password before saving it to the database
UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
     if (err) {
     return next(err);
     }
     user.password = hash;
     next();
  })
});


// authenticate input against database
UserSchema.statics.authenticate = async function (email, password, callback) {
  
  console.log("Kreni " + JSON.stringify(email));

  try {

    const user = await User.findOne({ email: email });

    if (!user) {

      const err = new Error('User not found.');
      err.status = 404;

      throw err;

    }
    
    const result = await bcrypt.compare(password, user.password);

    if (result) {
      return user;
    } else {

      const err = new Error('Username and password mismatch.');
      err.status = 401;

      throw err;

    }

  } catch (err) {

    throw err;

  }
}

var User = mongoose.model('User', UserSchema);

module.exports = User;