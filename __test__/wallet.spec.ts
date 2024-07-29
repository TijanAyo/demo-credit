import "reflect-metadata";

import { WalletService } from "../src/services";
import {
  UserRepository,
  WalletRepository,
  TransactionRepository,
} from "../src/repository";
import { AppResponse } from "../src/helper";
import { badRequestException } from "../src/common/constants";

jest.mock("../src/repository");
jest.mock("../src/helper");

describe("WalletService Test suite", () => {
  let walletService: WalletService;
  let walletRepositoryMock: jest.Mocked<WalletRepository>;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let transactionRepositoryMock: jest.Mocked<TransactionRepository>;

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

  const mockWallet = {
    id: 2,
    account_number: "123456",
    account_bank: "MOCK BANK",
    balance: 15020.0,
    user_id: 4,
    created_at: new Date("2024-07-29T14:04:06.000Z"),
    updated_at: new Date("2024-07-29T14:04:06.000Z"),
  };

  beforeEach(() => {
    walletRepositoryMock =
      new WalletRepository() as jest.Mocked<WalletRepository>;
    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    transactionRepositoryMock =
      new TransactionRepository() as jest.Mocked<TransactionRepository>;
    walletService = new WalletService(
      walletRepositoryMock,
      userRepositoryMock,
      transactionRepositoryMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw badRequestException if account is not found when funding wallet", async () => {
    const payload = { account_number: "123456", amount: 100 };
    walletRepositoryMock.findByAccountNumber.mockResolvedValue(null);

    await expect(
      walletService.fundWallet(mockWallet.user_id, payload)
    ).rejects.toThrow(badRequestException);
  });

  it("should fund wallet successfully", async () => {
    const payload = { account_number: "123456", amount: 100 };
    walletRepositoryMock.findByAccountNumber.mockResolvedValue(mockWallet);
    walletRepositoryMock.fundWallet.mockResolvedValue({ success: true });
    transactionRepositoryMock.createTransaction.mockResolvedValue({
      success: true,
    });

    const response = await walletService.fundWallet(
      mockWallet.user_id,
      payload
    );

    expect(response).toEqual(
      AppResponse(null, "Wallet credited successfully", true)
    );
    expect(walletRepositoryMock.findByAccountNumber).toHaveBeenCalledWith(
      payload.account_number
    );
    expect(walletRepositoryMock.fundWallet).toHaveBeenCalledWith(
      mockWallet.user_id,
      payload.amount
    );
    expect(transactionRepositoryMock.createTransaction).toHaveBeenCalled();
  });

  it("should throw badRequestException if receiver account is not found when transferring funds", async () => {
    const payload = {
      account_number: "654321",
      amount: 50,
      transaction_pin: "1234",
    };
    walletRepositoryMock.findByAccountNumber.mockResolvedValue(null);

    await expect(
      walletService.transfer(mockWallet.user_id, payload)
    ).rejects.toThrow(badRequestException);
  });

  it("should transfer funds successfully", async () => {
    const payload = {
      account_number: "123456",
      amount: 50,
      transaction_pin: "1234",
    };
    walletRepositoryMock.findByAccountNumber.mockResolvedValue(mockUser);
    walletRepositoryMock.findByWalletId.mockResolvedValue(mockWallet);
    walletRepositoryMock.makeTransfer.mockResolvedValue({ success: true });
    transactionRepositoryMock.createTransaction.mockResolvedValue({
      success: true,
    });

    const response = await walletService.transfer(mockWallet.user_id, payload);

    expect(response).toEqual(AppResponse(null, "Transfer successful", true));
    expect(walletRepositoryMock.findByAccountNumber).toHaveBeenCalledWith(
      payload.account_number
    );
    expect(walletRepositoryMock.findByWalletId).toHaveBeenCalledWith(
      mockWallet.user_id
    );
    expect(walletRepositoryMock.makeTransfer).toHaveBeenCalled();
    expect(transactionRepositoryMock.createTransaction).toHaveBeenCalledWith({
      amount: String(payload.amount),
      description: "Transfer",
      wallet_id: mockWallet.id,
    });
  });

  it("should withdraw funds successfully", async () => {
    const payload = { amount: 100, transaction_pin: "1234" };
    walletRepositoryMock.makeWithdrawal.mockResolvedValue({ success: true });
    walletRepositoryMock.findByWalletId.mockResolvedValue(mockWallet);
    transactionRepositoryMock.createTransaction.mockResolvedValueOnce({
      success: true,
    });

    console.log("Testing withdraw with mockWallet:", mockWallet);
    const response = await walletService.withdraw(mockWallet.user_id, payload);

    expect(response).toEqual(
      AppResponse(
        null,
        "Withdrawal successful, deposit will be made into settlement account",
        true
      )
    );
    expect(walletRepositoryMock.makeWithdrawal).toHaveBeenCalledWith({
      senderId: mockWallet.user_id,
      amount: payload.amount,
    });
    expect(walletRepositoryMock.findByWalletId).toHaveBeenCalledWith(
      mockWallet.user_id
    );
    expect(transactionRepositoryMock.createTransaction).toHaveBeenCalledWith({
      amount: String(payload.amount),
      description: "Withdraw",
      wallet_id: mockWallet.id,
    });
  });

  it("should throw badRequestException if pins do not match when setting transaction pin", async () => {
    const payload = { pin: "1234", confirm_pin: "5678" };

    await expect(walletService.setTransactionPin(8, payload)).rejects.toThrow(
      badRequestException
    );
  });

  it("should set transaction pin successfully", async () => {
    const payload = { pin: "1234", confirm_pin: "1234" };
    userRepositoryMock.setPin.mockResolvedValue({ success: true });

    const response = await walletService.setTransactionPin(8, payload);

    expect(response).toEqual(AppResponse(null, "Pin set successfully", true));
    expect(userRepositoryMock.setPin).toHaveBeenCalled();
  });

  it("should set settlement account successfully", async () => {
    const payload = { account_number: "123456", account_name: "John Doe" };
    userRepositoryMock.setSettlementAccount.mockResolvedValue({
      success: true,
    });

    const response = await walletService.setSettlementAccount(8, payload);

    expect(response).toEqual(
      AppResponse(null, "Account successfully set", true)
    );
    expect(userRepositoryMock.setSettlementAccount).toHaveBeenCalled();
  });
});
