exports.validatePassword = (password) =>{
    if(password.length < 6){
        return false;
    }
    return true;
}

exports.confirmPasswordsMatch = (password, passwordConf) =>{
    if(password == passwordConf){
        return true;
    }
    return false;
}