




var ApiResponse=function(status, isSuccess, message, data, res){
    var response_object = {};
    response_object.success = isSuccess;
    response_object.message = message;
    response_object.data = data;
    res.status(status).json(response_object);
     
}

/**
 * Summary : check whether the given fields are exists or not in the request
 * @param {Object} req
 * @param {Array} fields
 * @returns {String} missedFields
 */
var checkRequiredFields = (requiredFields) => {
    return (req, res, next) => {
        var missedFields = "";
        for (var i = 0; i < requiredFields.length; i++) {
            if (req.body[requiredFields[i]] === undefined || req.body[requiredFields[i]] === "") {
                if (missedFields.length != 0)
                    missedFields += ", "
                missedFields += requiredFields[i]
            }
        }
        if (missedFields.length > 0) {
            missedFields += " required";
            return  ApiResponse(400, false, "fields", missedFields, res)
        }
        else {
            next();
        }
    }
}

/**
 * Summary: This method is used to validate email address
 * @param String - email - to be validated
 * Returns - true if valid email, false otherwise
 */
var isValidEmail = (email) => {
    var pattern = new RegExp("^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@(([^<>()[\\]\\.,;:\\s@\"]+\\.)+[^<>()[\\]\\.,;:\\s@\"]{2,})$");
    return pattern.test(email);
}


/**
 * Summary : validates email and mobile number
 */
var validateEmailAndMobile = (req, res, next) => {
    if (req.body.email != undefined) {
        if (!isValidEmail(req.body.email)) {
            return  ApiResponse(400, false, "invalid-email", "null", res)
        }
    }
    next()
}

module.exports = {
    checkRequiredFields,
    isValidEmail,
    validateEmailAndMobile,
    ApiResponse
};