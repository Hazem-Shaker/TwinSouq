"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const register_1 = require("./register");
const verify_1 = require("./verify");
const login_1 = require("./login");
const update_password_1 = require("./update-password");
const get_1 = require("./get");
const reset_password_1 = require("./reset-password");
const be_provider_1 = require("./be-provider");
const update_user_data_1 = require("./update-user-data");
const delete_user_1 = require("./delete-user");
class UserService {
    constructor(mailerService) {
        this.mailerService = mailerService;
        this.registerLogic = new register_1.RegisterLogic(this.mailerService);
        this.verifyLogic = new verify_1.VerifyLogic(this.mailerService);
        this.loginLogic = new login_1.LoginLogic(this.verifyLogic);
        this.updatePasswordLogic = new update_password_1.UpdatePasswordLogic(this.mailerService);
        this.getUserLogic = new get_1.GetUserLogic();
        this.resetPasswordLogic = new reset_password_1.ResetPasswordLogic(this.mailerService);
        this.beProviderLogic = new be_provider_1.BeProviderLogic();
        this.updateUserDataLogic = new update_user_data_1.UpdateUserDataLogic();
        this.deleteUserLogic = new delete_user_1.DeleteUserLogic();
    }
    register(data, language) {
        console.log(data);
        return this.registerLogic.registerUser(data, language);
    }
    verify(data, language) {
        return this.verifyLogic.verifyUser(data, language);
    }
    resendOtp(data, language) {
        return this.verifyLogic.resendOtp(data, language);
    }
    login(data) {
        return this.loginLogic.login(data);
    }
    updatePassword(data, userId, language) {
        return this.updatePasswordLogic.updatePassword({ data, userId }, language);
    }
    getUser(userId, language) {
        return this.getUserLogic.getUser({ userId }, language);
    }
    requestPasswordReset(email, language) {
        return this.resetPasswordLogic.resetRequest({ email }, language);
    }
    verifyResetPasswordOtp(data, language) {
        return this.resetPasswordLogic.resetPasswordOtpVerify(data, language);
    }
    resetPassword(data, language) {
        return this.resetPasswordLogic.resetPassword(data, language);
    }
    beProvider(id, language) {
        return this.beProviderLogic.beProvider(id, language);
    }
    updateUserData(user, data, language) {
        return this.updateUserDataLogic.execute({ user, data });
    }
    deleteUser(user) {
        return this.deleteUserLogic.execute({ user });
    }
}
exports.UserService = UserService;
