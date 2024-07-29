import "reflect-metadata";

import { AuthService } from "../src/services";
import { UserRepository, WalletRepository } from "../src/repository";
import { AppResponse } from "../src/helper";
import { badRequestException } from "../src/common/constants";
import { generateAccessToken, compareHash } from "../src/utils";

jest.mock("../src/repository");
jest.mock("../src/helper");
jest.mock("../src/utils");

describe("AuthService Test Suite", () => {
  let authService: AuthService;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let walletRepositoryMock: jest.Mocked<WalletRepository>;
  let compareHashSpy: jest.SpyInstance;
  let generateAccessTokenSpy: jest.SpyInstance;

  const mockUser = {
    id: 8,
    first_name: "John",
    last_name: "Doe",
    email_address: "john.doe@example.com",
    bvn: "$2b$10$67E8qKgEAuSYhmMBppz8YO25NTEWiW3kDWy6vBoXvxtTeYlta5P4S",
    password: "$2b$10$mGolbJe5FoomGtOjVbXm3ezJxCJALmIY76iz0.UClVexjldtXX9da",
    phone_number: "908-734-9705",
    settlement_account_number: null,
    transaction_pin: null,
    is_settlement_account_set: 0,
    is_transaction_pin_set: 0,
    created_at: new Date("2024-07-29T14:04:06.000Z"),
    updated_at: new Date("2024-07-29T14:04:06.000Z"),
    settlement_account_name: null,
  };

  beforeEach(() => {
    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    walletRepositoryMock =
      new WalletRepository() as jest.Mocked<WalletRepository>;
    authService = new AuthService(userRepositoryMock, walletRepositoryMock);

    compareHashSpy = jest.spyOn(require("../src/utils"), "compareHash");
    generateAccessTokenSpy = jest.spyOn(
      require("../src/utils"),
      "generateAccessToken"
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw badRequestException if email is already associated with another user", async () => {
    const payload = {
      first_name: "John",
      last_name: "Doe",
      email_address: "john.doe@example.com",
      bvn: "12345678901",
      phone_number: "1234567890",
      password: "password123",
    };

    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);

    await expect(authService.register(payload)).rejects.toThrow(
      badRequestException
    );
  });

  it("Should register a new user successfully", async () => {
    const payload = {
      first_name: "John",
      last_name: "Doe",
      email_address: "john.doe@example.com",
      bvn: "12345678901",
      phone_number: "1234567890",
      password: "password123",
    };

    userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
    userRepositoryMock.createUser.mockResolvedValue({ success: true });
    userRepositoryMock.findByEmail.mockResolvedValueOnce(mockUser);
    walletRepositoryMock.createWallet.mockResolvedValue({ success: true });

    const response = await authService.register(payload);

    expect(response).toEqual(
      AppResponse(null, "Account created successfully", true)
    );
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      payload.email_address
    );
    expect(userRepositoryMock.createUser).toHaveBeenCalled();
    expect(walletRepositoryMock.createWallet).toHaveBeenCalled();
  });

  it("Should throw badRequestException if user not found", async () => {
    const payload = {
      email_address: "john.doe@example.com",
      password: "password123",
    };

    userRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(authService.login(payload)).rejects.toThrow(
      badRequestException
    );
  });

  it("Should throw badRequestException if password is invalid", async () => {
    const payload = {
      email_address: "john.doe@example.com",
      password: "wrongpassword",
    };

    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);

    await expect(authService.login(payload)).rejects.toThrow(
      badRequestException
    );
  });

  it("should login a user successfully", async () => {
    const payload = {
      email_address: "john.doe@example.com",
      password: "password123",
    };

    userRepositoryMock.findByEmail.mockResolvedValueOnce(mockUser);
    compareHashSpy.mockReturnValue(true);
    generateAccessTokenSpy.mockResolvedValue("mocked-access-token");

    const response = await authService.login(payload);

    expect(response).toEqual(
      AppResponse("jwt-token", "Authorization successful", true)
    );
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      payload.email_address
    );
    expect(compareHash).toHaveBeenCalledWith(
      payload.password,
      mockUser.password
    );
    expect(generateAccessToken).toHaveBeenCalledWith(mockUser.id);
  });
});
