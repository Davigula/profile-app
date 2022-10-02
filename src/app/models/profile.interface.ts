import { FileInfo } from "./file-info.interface";

export interface Profile {
  userId: string;
  imageUrl: string;
  public: boolean;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  occupations?: string[];
  motto?: string;
  address?: Address
  socialMedia?: SocialMedia[];
  bio?: string;
  documents: FileInfo[];
}

export interface Address {
  street: string;
  city: string;
  postCode: number;
  country: string;
}

export interface SocialMedia {
  name: string;
  url: string;
}

