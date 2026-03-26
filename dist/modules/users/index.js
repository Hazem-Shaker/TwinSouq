"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const user_service_1 = require("./user.service");
const user_router_1 = require("./user.router");
class UserModule {
    constructor(mailerService) {
        this.userService = new user_service_1.UserService(mailerService);
        this.userRouter = new user_router_1.UserRouter(this.userService);
    }
    routerFactory() {
        return this.userRouter.createRouter();
    }
}
exports.UserModule = UserModule;
