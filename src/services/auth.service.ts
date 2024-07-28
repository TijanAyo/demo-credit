import { injectable } from "tsyringe";
import { UserRepository } from "../repository";

@injectable()
export class AuthService {
  constructor(private readonly _userRepository: UserRepository) {}

  public async register() {}

  public async login() {}
}
