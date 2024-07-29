import { injectable } from "tsyringe";
import { UserRepository, WalletRepository } from "../repository";
import { registerSchema, loginSchema } from "../validations";
import { IcreateUser, signInPayload } from "../interfaces";
import {
  badRequestException,
  validationException,
} from "../common/constants/exception";
import { ZodError } from "zod";
import {
  compareHash,
  generateAccessToken,
  generateAccountNumber,
  hashPayload,
} from "../utils";
import { AppResponse } from "../helper";

@injectable()
export class AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _walletRepository: WalletRepository
  ) {}

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

      const [hashedPassword, hashedBVN] = await Promise.all([
        hashPayload(password),
        hashPayload(bvn),
      ]);

      // Create new user
      const newUser = await this._userRepository.createUser({
        first_name,
        last_name,
        email_address,
        password: hashedPassword,
        bvn: hashedBVN,
        phone_number,
      });

      if (!newUser.success) {
        throw new badRequestException(
          "An unexpected error has occurred while creating account"
        );
      }

      const createdUser = await this._userRepository.findByEmail(email_address);

      const walletData = {
        account_number: await this.generateUniqueAccountNumber(),
        user_id: createdUser.id,
      };
      // Create wallet for newly registered user
      const newWallet = await this._walletRepository.createWallet(walletData);
      if (!newWallet.success) {
        console.log("Error creating wallet for new user");
        throw new badRequestException(
          "An unexpected error has occurred while creating account"
        );
      }

      return AppResponse(null, "Account created successfully", true);
    } catch (err: any) {
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
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }

  private async generateUniqueAccountNumber(): Promise<string> {
    const accountNumber = await generateAccountNumber();

    const accountNumberExist = await this._walletRepository.findByAccountNumber(
      accountNumber
    );

    if (accountNumberExist) {
      return this.generateUniqueAccountNumber();
    }

    return accountNumber;
  }
}
