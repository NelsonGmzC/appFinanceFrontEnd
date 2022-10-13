//login
export interface Login {
  email: string,
  password: string
}

//transaction
export interface Transaction {
  category: string,
  categoryOpc: string,
  date: Date,
  notes: string,
  labels: Array<any>,
  amoint: number,
  coin: string,
  img: string,
  createdAt?: string,
  updateAt?: string,
  _id?: string,
  userId: string
}

//category
export interface Category {
  category: string,
  icon: string,
  color: string,
  name: string,
  _id?: string,
  userId: ''
}

//label
export interface Label {
  labels: Array<any>,
  _id?: string,
  userId: ''
}

export interface select {
  value: string;
  viewValue: string;
}