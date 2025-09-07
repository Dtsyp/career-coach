// eslint-disable-next-line import/no-unused-modules
export interface UserPublic {
  id: string;
  name: string;
  email: string;
}

// eslint-disable-next-line import/no-unused-modules
export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

// eslint-disable-next-line import/no-unused-modules
export interface UserLogin {
  email: string;
  password: string;
}

// eslint-disable-next-line import/no-unused-modules
export interface UserUpdateName {
  id: string;
  name?: string;
}

// eslint-disable-next-line import/no-unused-modules
export interface UserUpdatePassword {
  id: string;
  password?: string;
}
