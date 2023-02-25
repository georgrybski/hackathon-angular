import { UserViewData } from '../models/user-view-data';

export function mapToUserViewData(user: any): UserViewData {
  return {
    id: user.id,
    name: user.name,
    login: user.login,
    email: user.email,
    birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
    creationTime: user.creationTime ? new Date(user.creationTime) : undefined,
    updateTime: user.updateTime ? new Date(user.updateTime) : undefined
  };
}

export function formatDate(date: Date): string {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}
