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
