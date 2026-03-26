import { CreateLogic } from "./create";
import { LoginLogic } from "./login";

export class AdminService {
  createLogic: CreateLogic;
  loginLogic: LoginLogic; 

  constructor() {
    this.createLogic = new CreateLogic();
    this.loginLogic = new LoginLogic();
  }

  createAdmin(data: any) {
    return this.createLogic.create(data);
  }

  login(data: any) {
    return this.loginLogic.login(data);
  }
}