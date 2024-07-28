import { injectable } from "tsyringe";
import { KNEX } from "../db";
import { IcreateWallet } from "../interfaces";

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
}
