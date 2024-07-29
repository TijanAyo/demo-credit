import { injectable } from "tsyringe";
import { KNEX } from "../db";
import { IcreateTransaction } from "../interfaces";
import { generateTransactionReference } from "../utils";

@injectable()
export class TransactionRepository {
  async createTransaction(data: IcreateTransaction) {
    try {
      await KNEX("transactions").insert({
        amount: data.amount,
        status: "Success",
        description: data.description,
        reference: generateTransactionReference(),
        wallet_id: data.wallet_id,
      });

      return { success: true };
    } catch (err: any) {
      console.log("createTransactionError", err);
      throw err;
    }
  }
}
