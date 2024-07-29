export interface IcreateUser {
  first_name: string;
  last_name: string;
  email_address: string;
  bvn: string;
  password: string;
  phone_number: string;
}

export interface signInPayload {
  email_address: string;
  password: string;
}

export interface Iuser {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  bvn: string;
  password: string;
  phone_number: string;
  settlement_account: string;
  transaction_pin: string;
  is_settlement_account_set: boolean;
  is_transaction_pin_set: boolean;
}

export interface IcreateWallet {
  account_number: string;
  user_id: number;
}

export interface transferPayload {
  account_number: string;
  amount: number;
  transaction_pin: string;
}

export interface makeTransferPayload {
  senderId: number;
  receiverId: number;
  amount: number;
}

export interface setPinPayload {
  pin: string;
  confirm_pin: string;
}

export interface setAccountPayload {
  account_number: string;
  account_name: string;
}

export interface withdrawPayload {
  amount: number;
  transaction_pin: string;
}

export interface makeWithdrawalPayload {
  senderId: number;
  amount: number;
}

export interface fundWalletPayload {
  account_number: string;
  amount: number;
}

export interface IcreateTransaction {
  amount: string;
  description: string;
  wallet_id: number;
}

export interface walletResponse {
  id: number;
  account_number: string;
  account_bank: string;
  balance: number;
  user_id: number;
}
