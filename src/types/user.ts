export interface UserPublic {
  id: string;
  name: string;
  email: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserUpdateName {
  id: string;
  name?: string;
}

export interface UserUpdatePassword {
  id: string;
  password?: string;
}
