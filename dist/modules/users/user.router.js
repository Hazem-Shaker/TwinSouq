"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const user_controller_1 = require("./user.controller");
const express_1 = require("express");
const auth_1 = require("../../shared/middlewares/auth");
const upload_1 = require("../../shared/middlewares/upload");
class UserRouter {
    constructor(userService) {
        this.userService = userService;
        console.log(this.userService.register);
        this.userAuthMiddleware = new auth_1.UserAuthMiddleware();
        this.userController = new user_controller_1.UserContoller(this.userService);
    }
    createRouter() {
        const router = (0, express_1.Router)();
        router.post("/register", upload_1.upload.any(), this.userController.createUser.bind(this.userController));
        router.post("/verify", upload_1.upload.any(), this.userController.verifyUser.bind(this.userController));
        router.post("/resend-otp", upload_1.upload.any(), this.userController.resendOtp.bind(this.userController));
        router.post("/login", upload_1.upload.any(), this.userController.login.bind(this.userController));
        router.post("/update-password", upload_1.upload.any(), this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.userController.updatePassword.bind(this.userController));
        router.post("/request-password-reset", upload_1.upload.any(), this.userController.requestPasswordReset.bind(this.userController));
        router.post("/verify-reset-password-otp", upload_1.upload.any(), this.userController.verifyResetPasswordOtp.bind(this.userController));
        router.post("/reset-password", upload_1.upload.any(), this.userController.resetPassword.bind(this.userController));
        router.put("/be-provider", upload_1.upload.any(), this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.userController.beProvider.bind(this.userController));
        router.put("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), upload_1.upload.fields([
            {
                name: "photo",
                maxCount: 1,
            },
        ]), (0, upload_1.processImagesMiddleware)(["photo"]), this.userController.updateUserData.bind(this.userController));
        router.delete("/", this.userAuthMiddleware.authenticate.bind(this.userAuthMiddleware), this.userController.deleteUser.bind(this.userController));
        return router;
    }
}
exports.UserRouter = UserRouter;
