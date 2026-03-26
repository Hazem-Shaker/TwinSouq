import { CreateLogic } from "./create";
import { GetLogic } from "./get";
import { DeleteLogic } from "./delete";
import { UpdateLogic } from "./update";
import { ListLogic } from "./list";
import mongoose from "mongoose";
import Address from "./adress.model";
export class AddressService {
  private createLogic: CreateLogic;
  private getLogic: GetLogic;
  private deleteLogic: DeleteLogic;
  private updateLogic: UpdateLogic;
  private listLogic: ListLogic;
  constructor() {
    this.createLogic = new CreateLogic();
    this.getLogic = new GetLogic();
    this.deleteLogic = new DeleteLogic();
    this.updateLogic = new UpdateLogic();
    this.listLogic = new ListLogic();
  }

  createAddress(owner: any, data: any, language: string) {
    return this.createLogic.create({ owner, ...data }, language);
  }

  updateAddress(id: any, owner: any, data: any, language: string) {
    return this.updateLogic.update({ id, data: { owner, ...data } }, language);
  }

  listAddresses(owner: any, language: string) {
    return this.listLogic.list({ owner }, language);
  }

  getAddress(id: any, owner: any, language: string) {
    return this.getLogic.get({ id, owner }, language);
  }

  deleteAddress(id: any, owner: any, language: string) {
    return this.deleteLogic.remove({ id, owner }, language);
  }

  getAddressForUser(
    id: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId
  ) {
    return Address.findOne({ _id: id, owner: user });
  }
}
