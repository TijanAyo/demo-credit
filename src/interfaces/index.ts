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
