import { injectable } from "tsyringe";
import { WalletRepository, UserRepository } from "../repository";
import { setPinPayload, transferPayload } from "../interfaces";
import { badRequestException, validationException } from "../common/constants";
import { ZodError } from "zod";
import { setTransactionPinSchema, transferSchema } from "../validations";
import { AppResponse } from "../helper";
import { hashPayload } from "../utils";

@injectable()
export class WalletService {
  constructor(
    private readonly _walletRepository: WalletRepository,
    private readonly _userRepository: UserRepository
  ) {}

  public async fundWallet() {}

  public async transfer(userId: number, payload: transferPayload) {
    try {
      const { account_number, amount } = await transferSchema.parseAsync(
        payload
      );

      const receiver = await this._walletRepository.findByAccountNumber(
        account_number
      );
      if (!receiver) {
        throw new badRequestException(
          "Could not retrieve user associated with account number"
        );
      }

      const makeTransfer = await this._walletRepository.makeTransfer({
        senderId: userId,
        receiverId: receiver.id,
        amount,
      });

      if (!makeTransfer.success) {
        throw new badRequestException(
          "An unexpected error has occurred, kindly try again in a few minute"
        );
      }

      return AppResponse(null, "Transfer successful", true);
    } catch (err: any) {
      console.log("transferError:", err);
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }

  public async withdraw() {}

  public async setTransactionPin(userId: number, payload: setPinPayload) {
    try {
      const { pin, confirm_pin } = await setTransactionPinSchema.parseAsync(
        payload
      );

      if (pin !== confirm_pin) {
        throw new badRequestException("Pin does not match");
      }

      const hashedPin = await hashPayload(confirm_pin);

      const setPin = await this._userRepository.setPin(userId, hashedPin);
      if (!setPin.success) {
        throw new badRequestException(
          "An unexpected error occured while setting up pin"
        );
      }

      return AppResponse(null, "Pin set successfully", true);
    } catch (err: any) {
      console.log("setTransactionPinError:", err);
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }
}
