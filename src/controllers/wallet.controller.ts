import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { ErrorHandler } from "../helper";

@injectable()
export class WalletController {
  constructor() {}

  public async fundWallet(req: Request, res: Response) {}

  public async transfer(req: Request, res: Response) {}

  public async withdraw(req: Request, res: Response) {}
}
