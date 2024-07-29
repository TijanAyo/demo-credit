import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { WalletService } from "../services";
import { ErrorHandler } from "../helper";

@injectable()
export class WalletController {
  constructor(
    private readonly _walletService: WalletService,
    private readonly _errorHandler: ErrorHandler
  ) {}

  public async setTransactionPin(req: Request, res: Response) {
    const user = req.user;
    try {
      const response = await this._walletService.setTransactionPin(
        user.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (err: any) {
      return await this._errorHandler.handleCustomError(err, res);
    }
  }

  public async setSettlementAccount(req: Request, res: Response) {
    const user = req.user;
    try {
      const response = await this._walletService.setSettlementAccount(
        user.id,
        req.body
      );
      return res.status(200).json(response);
    } catch (err: any) {
      return await this._errorHandler.handleCustomError(err, res);
    }
  }

  public async fundWallet(req: Request, res: Response) {
    const user = req.user;
    try {
      const response = await this._walletService.fundWallet(user.id, req.body);
      return res.status(200).json(response);
    } catch (err: any) {
      return await this._errorHandler.handleCustomError(err, res);
    }
  }

  public async transfer(req: Request, res: Response) {
    const user = req.user;
    try {
      const response = await this._walletService.transfer(user.id, req.body);
      return res.status(200).json(response);
    } catch (err: any) {
      return await this._errorHandler.handleCustomError(err, res);
    }
  }

  public async withdraw(req: Request, res: Response) {
    const user = req.user;
    try {
      const response = await this._walletService.withdraw(user.id, req.body);
      return res.status(200).json(response);
    } catch (err: any) {
      return await this._errorHandler.handleCustomError(err, res);
    }
  }
}
