var bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WowSome = new Schema({
    name: { type: String },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: { type: String },
    phone_number: { type: Number },
    is_currently_logged_In:{type : Boolean},
    token:{type: String}
});

WowSome.pre('save', function (next) {
    var wowuser = this;
    if (wowuser.password != undefined) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw Error(err);
            bcrypt.hash(wowuser.password, salt, (err, hash) => {
                if (err) throw Error(err);
                wowuser.password = hash;
                next();
            });
        });
    }
    else{
        next();
    }
});

/**
 * validating email & password
 */
WowSome.statics.findByCredentials = function (email_id, password) {
    var User = this;
    return User.findOne({ email: email_id }).then((user) => {
        if (!user) return Promise.reject();
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password).then((result) => {
                if (result) resolve(user);
                else reject();
            });
        });
    });
}

var wowSome = mongoose.model('wowsome', WowSome);

module.exports = wowSome;
