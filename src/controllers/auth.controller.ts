import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { AuthService } from "../services";
import { ErrorHandler } from "../helper";

@injectable()
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _errorHandler: ErrorHandler
  ) {}

  public async register(req: Request, res: Response) {
    try {
      const response = await this._authService.register(req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await this._errorHandler.handleCustomError(err, res);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const response = await this._authService.login(req.body);
      return res.status(200).json(response);
    } catch (err: any) {
      return await this._errorHandler.handleCustomError(err, res);
    }
  }
}
