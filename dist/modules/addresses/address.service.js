"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const create_1 = require("./create");
const get_1 = require("./get");
const delete_1 = require("./delete");
const update_1 = require("./update");
const list_1 = require("./list");
const adress_model_1 = __importDefault(require("./adress.model"));
class AddressService {
    constructor() {
        this.createLogic = new create_1.CreateLogic();
        this.getLogic = new get_1.GetLogic();
        this.deleteLogic = new delete_1.DeleteLogic();
        this.updateLogic = new update_1.UpdateLogic();
        this.listLogic = new list_1.ListLogic();
    }
    createAddress(owner, data, language) {
        return this.createLogic.create({ owner, ...data }, language);
    }
    updateAddress(id, owner, data, language) {
        return this.updateLogic.update({ id, data: { owner, ...data } }, language);
    }
    listAddresses(owner, language) {
        return this.listLogic.list({ owner }, language);
    }
    getAddress(id, owner, language) {
        return this.getLogic.get({ id, owner }, language);
    }
    deleteAddress(id, owner, language) {
        return this.deleteLogic.remove({ id, owner }, language);
    }
    getAddressForUser(id, user) {
        return adress_model_1.default.findOne({ _id: id, owner: user });
    }
}
exports.AddressService = AddressService;
