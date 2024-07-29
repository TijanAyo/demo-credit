import { injectable } from "tsyringe";
import {
  WalletRepository,
  UserRepository,
  TransactionRepository,
} from "../repository";
import {
  setPinPayload,
  setAccountPayload,
  transferPayload,
  withdrawPayload,
  fundWalletPayload,
} from "../interfaces";
import { badRequestException, validationException } from "../common/constants";
import { ZodError } from "zod";
import {
  fundWalletSchema,
  setSettlementAccountSchema,
  setTransactionPinSchema,
  transferSchema,
  withdrawSchema,
} from "../validations";
import { AppResponse } from "../helper";
import { hashPayload } from "../utils";

@injectable()
export class WalletService {
  constructor(
    private readonly _walletRepository: WalletRepository,
    private readonly _userRepository: UserRepository,
    private readonly _transactionRepository: TransactionRepository
  ) {}

  public async fundWallet(userId: number, payload: fundWalletPayload) {
    try {
      const { account_number, amount } = await fundWalletSchema.parseAsync(
        payload
      );

      const account = await this._walletRepository.findByAccountNumber(
        account_number
      );

      if (!account) {
        throw new badRequestException(
          "Could not retrieve user associated with account number"
        );
      }

      const creditWallet = await this._walletRepository.fundWallet(
        userId,
        amount
      );
      if (!creditWallet.success) {
        throw new badRequestException(
          "An unexpected error occured while funding wallet"
        );
      }

      await this._transactionRepository.createTransaction({
        amount: String(amount),
        description: "Funding",
        wallet_id: account.id,
      });

      return AppResponse(null, "Wallet credited successfully", true);
    } catch (err: any) {
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }

  public async transfer(userId: number, payload: transferPayload) {
    try {
      const { account_number, amount } = await transferSchema.parseAsync(
        payload
      );

      const [receiver, account] = await Promise.all([
        this._walletRepository.findByAccountNumber(account_number),
        this._walletRepository.findByWalletId(userId),
      ]);

      if (!receiver) {
        throw new badRequestException(
          "Could not retrieve user associated with account number"
        );
      }

      const makeTransfer = await this._walletRepository.makeTransfer({
        senderId: userId,
        receiverId: receiver.user_id,
        amount,
      });

      if (!makeTransfer.success) {
        throw new badRequestException(
          "An unexpected error has occurred, kindly try again in a few minute"
        );
      }

      await this._transactionRepository.createTransaction({
        amount: String(amount),
        description: "Transfer",
        wallet_id: account.id,
      });

      return AppResponse(null, "Transfer successful", true);
    } catch (err: any) {
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }

  public async withdraw(userId: number, payload: withdrawPayload) {
    try {
      const { amount } = await withdrawSchema.parseAsync(payload);

      const [makeWithdrawal, account] = await Promise.all([
        this._walletRepository.makeWithdrawal({
          senderId: userId,
          amount,
        }),
        this._walletRepository.findByWalletId(userId),
      ]);

      if (!makeWithdrawal.success) {
        throw new badRequestException(
          "An unexpected error has occurred, kindly try again in a few minute"
        );
      }

      await this._transactionRepository.createTransaction({
        amount: String(amount),
        description: "Withdraw",
        wallet_id: account.id,
      });

      return AppResponse(
        null,
        "Withdrawal successful, deposit will be made into settlement account",
        true
      );
    } catch (err: any) {
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }

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
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }

  public async setSettlementAccount(
    userId: number,
    payload: setAccountPayload
  ) {
    try {
      const { account_number, account_name } =
        await setSettlementAccountSchema.parseAsync(payload);

      const setAccount = await this._userRepository.setSettlementAccount(
        userId,
        account_number,
        account_name
      );
      if (!setAccount.success) {
        throw new badRequestException(
          "An unexpected error occured while updating account information"
        );
      }

      return AppResponse(null, "Account successfully set", true);
    } catch (err: any) {
      if (err instanceof ZodError) {
        throw new validationException(err.errors[0].message);
      }
      throw err;
    }
  }
}
