'use strict';
const moment = require('moment');

let errors = [];

function ValidationContract() {
    errors = [];
}

ValidationContract.prototype.isRequired = (value, message) => {
    if (!value || value.length <= 0)
        errors.push({ message: message });
}

ValidationContract.prototype.isIsoDateValid = (value, message) => {
    return moment(value, "yyyy-MM-dd'T'HH:mm:ssZ").isValid();
}

ValidationContract.prototype.errors = () => {
    return errors;
}

ValidationContract.prototype.clear = () => {
    errors = [];
}

ValidationContract.prototype.isValid = () => {
    return errors.length == 0;
}


module.exports = ValidationContract;