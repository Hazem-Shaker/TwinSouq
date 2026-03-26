import bcrypt from "bcryptjs";
import { inputSchema, Input } from "./input";
import Admin from "../admin.model";
import { IAdmin } from "../types";
import { config } from "../../../shared/config";
import { InvalidCredentialsError } from "../../../shared/utils/custom-errors";
import { generateToken } from "../../../shared/utils/auth/tokenUtils";

export class CreateLogic {
  async create(data: Input) {
    // Validate input data
    data = inputSchema.parse(data);

    // Check if the email already exists
    data = inputSchema.parse(data);
    const existingAdmin = await Admin.findOne({ email: data.email });
    if (existingAdmin) {
      throw new InvalidCredentialsError("Email already in use.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      data.password,
      config.bcrypt.saltRounds
    );

    data.password = hashedPassword;

    // Create the admin document
    const admin = await Admin.create(data);

    // Convert admin document to a plain object
    const adminData: IAdmin = admin.toObject();

    // Return the created admin
    return "Admin created successfully";
  }
}
