import { Request, Response, NextFunction } from "express";
import { KNEX } from "../db";
import { compareHash } from "../utils";

export const validateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { amount, transaction_pin } = req.body;

    if (!user.is_transaction_pin_set) {
      return res.status(400).json({
        data: null,
        message:
          "Transaction pin not set, kindly set a transaction pin before performing this action",
        success: false,
      });
    }

    if (!user.is_settlement_account_set) {
      return res.status(400).json({
        data: null,
        message:
          "Settlement account is missing, kindly provide an account before performing this action",
        success: false,
      });
    }

    const walletInfo = await KNEX("wallets").where("user_id", user.id).first();

    if (walletInfo.balance < amount) {
      return res.status(400).json({
        data: null,
        message: "Insufficient balance to complete transaction",
        success: false,
      });
    }

    const doesPinMatch = await compareHash(
      transaction_pin,
      user.transaction_pin
    );
    if (!doesPinMatch) {
      return res.status(400).json({
        data: null,
        message: "Invalid transaction pin, kindly check input and try again",
        success: false,
      });
    }

    next();
  } catch (err: any) {
    console.error("Error in validateTransactionError:", err);
    return res.status(500).json({
      data: null,
      message: "Internal server error",
      success: false,
    });
  }
};
