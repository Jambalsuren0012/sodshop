export interface Address {
  city: string;
  district: string;
  khoroo: string;
  detail: string;
  label: string;
}

export interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  status: number;
  address: Address;
  created_at: string;
}
