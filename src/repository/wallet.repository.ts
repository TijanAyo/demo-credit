import { injectable } from "tsyringe";
import { KNEX } from "../db";
import { IcreateWallet, makeTransferPayload } from "../interfaces";

@injectable()
export class WalletRepository {
  async createWallet(data: IcreateWallet) {
    try {
      await KNEX("wallets").insert({
        account_number: data.account_number,
        account_bank: "MOCK BANK",
        user_id: data.user_id,
      });

      return { success: true };
    } catch (err: any) {
      console.log("createWalletError", err);
      throw err;
    }
  }

  async findByAccountNumber(account_number: string) {
    try {
      return await KNEX("wallets")
        .where("account_number", account_number)
        .first();
    } catch (err: any) {
      console.log("findByAccountNumberError:", err);
      throw err;
    }
  }

  async makeTransfer(data: makeTransferPayload) {
    const trx = await KNEX.transaction();
    try {
      // Debit the sender
      await trx("wallets")
        .where("user_id", data.senderId)
        .decrement("balance", data.amount);

      // Credit the receiver
      await trx("wallets")
        .where("user_id", data.receiverId)
        .increment("balance", data.amount);

      await trx.commit();

      return { success: true };
    } catch (err: any) {
      console.log("makeTransferError:", err);
      await trx.rollback();
      throw err;
    }
  }
}
