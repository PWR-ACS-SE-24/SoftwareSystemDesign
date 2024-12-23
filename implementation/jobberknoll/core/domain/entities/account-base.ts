export type AccountBase = {
  id: string;
  fullName: string;
  email: string;
  hashedPassword: string;
  isActive: boolean;
  lastModified: number;
};
