import { injectable } from "tsyringe";
import { KNEX } from "../db";
import { IcreateUser } from "../interfaces";

@injectable()
export class UserRepository {
  async findByEmail(email: string) {
    try {
      return await KNEX("users").where("email_address", email).first();
    } catch (err: any) {
      console.log("findByEmailError:", err);
      throw err;
    }
  }

  async createUser(data: IcreateUser) {
    try {
      return await KNEX("users").insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email_address: data.email_address,
        bvn: data.bvn,
        password: data.password,
        phone_number: data.phone_number,
      });
    } catch (err: any) {
      console.error("createUserError", err);
      throw err;
    }
  }
}
