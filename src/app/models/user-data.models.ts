export interface UserCreationData {
  name: string;
  login: string;
  password: string;
  email: string;
  birthDate?: Date;
}

export interface UserUpdateData extends UserCreationData{
  id: number;
}

export interface UserViewData {
  id: number;
  name: string;
  login: string;
  email: string;
  birthDate?: Date;
  creationTime?: Date;
  updateTime?: Date;
}

