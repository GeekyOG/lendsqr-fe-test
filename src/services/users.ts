import type { User, UserStatus } from "@/types/user";

const API_URL = "https://lendsqr-fe-test-be.vercel.app/generated-users";

let usersPromise: Promise<User[]> | null = null;

function loadUsers(): Promise<User[]> {
  if (!usersPromise) {
    usersPromise = fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`);
        }
        return response.json() as Promise<User[]>;
      })
      .catch((error: unknown) => {
        usersPromise = null;
        throw error;
      });
  }
  return usersPromise;
}

export interface UsersFilters {
  organization?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  date?: string;
  status?: UserStatus;
}

export interface FetchUsersParams {
  page: number;
  pageSize: number;
  filters?: UsersFilters;
}

export interface UsersPage {
  data: User[];
  total: number;
}

function matchesFilters(user: User, filters?: UsersFilters): boolean {
  if (!filters) {
    return true;
  }

  if (filters.organization && !user.organization.toLowerCase().includes(filters.organization.toLowerCase())) {
    return false;
  }
  if (filters.username && !user.username.toLowerCase().includes(filters.username.toLowerCase())) {
    return false;
  }
  if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
    return false;
  }
  if (filters.phoneNumber && !user.phoneNumber.includes(filters.phoneNumber)) {
    return false;
  }
  if (filters.status && user.status !== filters.status) {
    return false;
  }
  if (filters.date && !user.dateJoined.startsWith(filters.date)) {
    return false;
  }

  return true;
}

export async function fetchUsers({ page, pageSize, filters }: FetchUsersParams): Promise<UsersPage> {
  const users = await loadUsers();
  const filtered = users.filter((user) => matchesFilters(user, filters));
  const start = (page - 1) * pageSize;
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
  };
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await loadUsers();
  return users.find((user) => user.id === id);
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<User | undefined> {
  const users = await loadUsers();
  const user = users.find((item) => item.id === id);
  if (user) {
    user.status = status;
  }
  return user;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
}

export async function getUserStats(): Promise<UserStats> {
  const users = await loadUsers();
  return {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.status === "active").length,
    usersWithLoans: Math.round(users.length * 0.42),
    usersWithSavings: Math.round(users.length * 0.83),
  };
}

export async function getOrganizations(): Promise<string[]> {
  const users = await loadUsers();
  return Array.from(new Set(users.map((user) => user.organization))).sort((a, b) => a.localeCompare(b));
}
