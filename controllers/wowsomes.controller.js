var usermodel = require('../models/wowsome');
var userSession = require('../models/user_session');
var utility = require('../utility/utility');
var requiredFields = require('../config/required_fields');
var moment = require('moment');
const jwt = require('jsonwebtoken');
/**
 * get all wowsomeusers list
*/
var getwowsomesUserDetails = (req, res) => {
    usermodel.findOne({email: req.params.email}, { password: 0 }).then(
        (data) => {
            utility.ApiResponse(200, true, " Success", data, res);
        }
    ).catch((e) => {
        utility.ApiResponse(400, false, "bad request", e, res);
    });
}

/**
 * Summary : create user
 * @api {post} /wowsome
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Object} res object
 */
var create = (req, res, next) => {
    var userModel = new usermodel(req.body);
    userModel.save()
        .then((userdata) => {
            return utility.ApiResponse(200, true, "Registration successful", userdata, res)
        })
        .catch((e) => {
            return utility.ApiResponse(400, false, "user saving failed, something went wrong", e, res)
        });
};

/**
 * Summary : verify user email
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 *  	calls the next middleware function in the stack
 * @returns {Object} res 
 */
var verifyUserByEmail = (req, res, next) => {
    usermodel.findOne({ email: req.body.email }).then((user) => {
        if (user != null) {
            return utility.ApiResponse(409, false, "user already existed ", "conflict", res)
        }
        else {
            next();
        }

    }).catch((e) => {
        return utility.ApiResponse(400, false, "bad request", e, res)
    });
}
/**
 * delete todo data by id
 * @param {*Object} req 
 * @param {*Object} res 
 */
// NOTE : we can use remove(), findByIdAndRemove() based on requirment.
// var deletewowsomeById = (req, res) => {
//     masterTodo.findOneAndRemove({ _id: req.params.id }).then(
//         (data) => {

//             ApiResponse(200, true, " Success", data, res);
//         }
//     ).catch((e) => {
//         ApiResponse(400, false, "bad request", e, res);
//     });
// }

/**
 * Summary : find the user by emailid
 * @api {post} /auth
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 *      calls the next middle ware function in the stack
 * @returns {Object} res
 */
var findUserByEmailId = (req, res, next) => {
    var Email = req.body.email.toLowerCase();

    usermodel.findOne({ email: Email }).then((user) => {
        if (!user) {
            return utility.ApiResponse(404, false, "user not found", "", res);
        }
        else {
            next();
        }
    }).catch((err) => {
        return utility.ApiResponse(400, false, "bad request", err, res);
    });
}

/**
 * Summary : get the user by user_id & password
 * @api {post} /user/auth
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next
 * 		calls the next middleware function in the stack
 * @returns {Object} res 
 */
var findUserByLogin = (req, res, next) => {
    usermodel.findByCredentials(req.body.email, req.body.password).then(
        (user) => {
            if (!user) {
                return utility.ApiResponse(404, false, "user not found", "", res);
            }
            else {
                req.userData = {}
                req.userData._id = user._id;
                req.userData.user_id = user.user_id;
                next();
            }
        }
    ).catch((err) => {
        return utility.ApiResponse(400, false, "incorrect password", err, res);
    })
}


/**
 * Summary : creates the document in session collection 
 * @api {post} /user/activate
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 *  	calls the next middleware function in the stack
 * @returns {Object} res
 */
var login = (req, res, next) => {
    var sessionData = {};
    var userData = {};
    var token_id = req.userData._id || req.userData._doc._id;
    sessionData.token = generateAuthToken(token_id);
    sessionData.email = req.body.email;
    sessionData.expiration_time = moment.utc().add(requiredFields.AUTH_TOKEN_EXPIRATION_TIME, 'minutes').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    var usersession = new userSession(sessionData);
    usersession.save().then((session) => {
        req.userData.token = session.token;
        req.userData.login_status = true;
       
        next();
    }).catch((e) => {
        return utility.ApiResponse(400, false, "bad request", e, res);
    });


}

/**
 * Summary : generates the jwt token by using the email
 * @param {String} email 
 * @return {String} token
 */
var generateAuthToken = function (email) {
    var access = 'auth';
    var token = jwt.sign({
        _id: email.toHexString(),
        access
    }, requiredFields.JWT_SECRET).toString();
    return token;
}

/**
 * Summary : checks the token if expires updates with new token 
 * @api {post} /user/auth
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 *      calls the next middleware function in the stack
 * @returns {Object} res 
 */
var checkTokenExists = (req, res, next) => {
    userSession.findOne({ email: req.body.email }).then(
        (session) => {
            if (!session) {
                next();

            }
            else {
                updateSession(req, res, next);
            }
        }
    ).catch((e) => {
        return utility.ApiResponse(400, false, "bad request", e, res)
    });
}


/**
 * Summary : create the new token and update that token for the user
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 *    calls the next middleware function in the stack
 * @returns {Object} res
 */
var updateSession = (req, res, next) => {
    var sessiondata = {};
    sessiondata.token = generateAuthToken(req.userData._id);
    sessiondata.expiration_time = moment.utc().add(requiredFields.AUTH_TOKEN_EXPIRATION_TIME, 'minutes').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    userSession.findOneAndUpdate({ email: req.body.email }, sessiondata, { new: true }).then(
        (session) => {
            if (!session) {
                return utility.ApiResponse(404, false, "not found", session, res);
            }
            else {
           
                return utility.ApiResponse(201, true, "session updated", session, res);
            }
        }
    ).catch((e) => {
        return utility.ApiResponse(400, false, "error while updating session", e, res);
    });
}

/**
 * Summary : updating user login status
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 *    calls the next middleware function in the stack
 * @returns {Object} res
 */
var updateUserLoginStatus = (isLoggedIn) => {
    return (req, res, next) => {
        var Email = req.body.email.toLowerCase();
        queryData = {
            email: Email
        }
        updateData = {
            is_currently_logged_In: isLoggedIn,
        };

        if (isLoggedIn == true) {
            var token = req.userData.token;
        }

        usermodel.findOneAndUpdate(queryData, updateData, { new: true }).then((user) => {
            if (user != null && isLoggedIn) {
                user.token = token;
                return utility.ApiResponse(200, true, "user successfully logged in ", user, res);
            }
            else if(isLoggedIn == false){
                return utility.ApiResponse(200, true, "user successfully logged out ", user, res);
            }
        }).catch((e) => {
            return utility.ApiResponse(400, false, "user failed logged in ", e, res)
        });
    }
}

/**
 * Summary : logging out the user
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Object} res
 */
var logout = (req, res, next) => {
    userSession.findOne({ email: req.body.email }).remove().then((session) => {
        if (session.n != null) {
            next();
        }
        else {
            return utility.ApiResponse(401, false, "unauthorized user ", session, res)
        }
    }).catch((e) => {
        return utility.ApiResponse(400, false, "bad request ", e, res)
    });
}

module.exports = {
    create,
    verifyUserByEmail,
    getwowsomesUserDetails,
    findUserByEmailId,
    findUserByLogin,
    login,
    logout,
    updateSession,
    checkTokenExists,
    updateUserLoginStatus
};