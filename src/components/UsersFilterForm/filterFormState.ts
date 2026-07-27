import type { UserStatus } from "@/types/user";

export interface FilterFormState {
  organization: string;
  username: string;
  email: string;
  date: string;
  phoneNumber: string;
  status: UserStatus | "";
}

export const EMPTY_FILTER_FORM: FilterFormState = {
  organization: "",
  username: "",
  email: "",
  date: "",
  phoneNumber: "",
  status: "",
};
