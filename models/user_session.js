const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var signInSessionSchema = mongoose.Schema({

    token: {
        type: String
    },
    expiration_time: {
        type: Date
    },
    email: {
        type: String
    }

})

var Session = mongoose.model('signin_session', signInSessionSchema);
module.exports = Session;

