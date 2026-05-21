export type Role = "ADMIN" | "USER" | "STORE_OWNER";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  address:string;
  storedId?: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId?: string;
  averageRating: number;
  totalRating: number;
}


export interface Rating {
    id:string,
    userId:string,
    storedId:string,
    value:number
}

export interface AuthContextType {
    user : User | null,
    token : string | null,
    login : (email :string,password:string) => void,
    logout : () => void,
    isLoading : boolean
}

export interface AdminStats {
    totalUsers : number,
    totalStores :number,
    totalRatings:number
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}