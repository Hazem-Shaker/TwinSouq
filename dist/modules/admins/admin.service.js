"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const create_1 = require("./create");
const login_1 = require("./login");
class AdminService {
    constructor() {
        this.createLogic = new create_1.CreateLogic();
        this.loginLogic = new login_1.LoginLogic();
    }
    createAdmin(data) {
        return this.createLogic.create(data);
    }
    login(data) {
        return this.loginLogic.login(data);
    }
}
exports.AdminService = AdminService;
