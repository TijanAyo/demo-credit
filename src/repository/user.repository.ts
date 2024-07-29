import { injectable } from "tsyringe";
import { KNEX } from "../db";
import { IcreateUser } from "../interfaces";

@injectable()
export class UserRepository {
  async findByEmail(email: string) {
    try {
      const user = await KNEX("users").where("email_address", email).first();
      return user;
    } catch (err: any) {
      console.log("findByEmailError:", err);
      throw err;
    }
  }

  async createUser(data: IcreateUser) {
    try {
      await KNEX("users").insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email_address: data.email_address,
        bvn: data.bvn,
        password: data.password,
        phone_number: data.phone_number,
      });

      return { success: true };
    } catch (err: any) {
      console.error("createUserError", err);
      throw err;
    }
  }

  async setPin(userId: number, pin: string) {
    try {
      await KNEX("users")
        .where("id", userId)
        .update({ transaction_pin: pin, is_transaction_pin_set: true });

      return { success: true };
    } catch (err: any) {
      console.log("setPinError", err);
      throw err;
    }
  }

  async setSettlementAccount(
    userId: number,
    account_number: string,
    account_name: string
  ) {
    try {
      await KNEX("users").where("id", userId).update({
        settlement_account_number: account_number,
        settlement_account_name: account_name,
        is_settlement_account_set: true,
      });

      return { success: true };
    } catch (err: any) {
      console.log("setPinError", err);
      throw err;
    }
  }
}
