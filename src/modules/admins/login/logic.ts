import bcrypt from "bcrypt";
import Admin from "../admin.model";
import { inputSchema, Input } from "./input";
import { IAdminResponseData } from "../types";
import { InvalidCredentialsError } from "../../../shared/utils/custom-errors";
import { generateToken } from "../../../shared/utils/auth/tokenUtils";

export class LoginLogic {
  async login(data: Input) {
    data = inputSchema.parse(data);
    const { email, password } = data;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new InvalidCredentialsError("Invalid email or password.");
    }

    // Convert admin document to a plain object
    const adminData: IAdminResponseData = admin.toObject();

    // Remove sensitive or unnecessary fields from the admin data
    delete adminData.password;
    delete adminData.__v;

    // Add `id` field to the response
    adminData.id = admin._id;

    const token = await generateToken(admin._id);

    delete adminData._id;

    return { admin: adminData, token };
  }
}
