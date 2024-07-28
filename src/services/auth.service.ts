import { injectable } from "tsyringe";
import { UserRepository } from "../repository";
import { registerSchema, loginSchema } from "../validations";
import { IcreateUser, signInPayload } from "../interfaces";
import {
  badRequestException,
  validationException,
} from "../common/constants/exception";
import { ZodError } from "zod";
import { compareHash, generateAccessToken, hashPayload } from "../utils";
import { AppResponse } from "../helper";

@injectable()
export class AuthService {
  constructor(private readonly _userRepository: UserRepository) {}

  public async register(payload: IcreateUser) {
    try {
      const {
        first_name,
        last_name,
        email_address,
        bvn,
        phone_number,
        password,
      } = await registerSchema.parseAsync(payload);

      const user = await this._userRepository.findByEmail(email_address);
      if (user) {
        throw new badRequestException(
          "Email address is already associated with another user"
        );
      }

      const hashedPassword = await hashPayload(password);
      const hashedBVN = await hashPayload(bvn);
      const data = {
        first_name,
        last_name,
        email_address,
        password: hashedPassword,
        bvn: hashedBVN,
        phone_number,
      };

      const newUser = await this._userRepository.createUser(data);

      // Also create wallet for user

      if (!newUser) {
        console.log("Error creating users");
        throw new badRequestException("An unexpected error has occurred");
      }

      return AppResponse(null, "Account created successfully", true);
    } catch (err: any) {
      console.log("registerError", err);
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }

  public async login(payload: signInPayload) {
    try {
      const { email_address, password } = await loginSchema.parseAsync(payload);

      const user = await this._userRepository.findByEmail(email_address);
      if (!user) {
        throw new badRequestException("User not found");
      }

      const isPasswordValid = await compareHash(password, user.password);
      if (!isPasswordValid) {
        throw new badRequestException(
          "Invalid credentials, kindly check input and try again"
        );
      }

      const token = await generateAccessToken(user.id);

      return AppResponse(token, "Authorization successful", true);
    } catch (err: any) {
      console.log("loginError", err);
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }
}
