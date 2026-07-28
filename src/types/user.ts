export type UserStatus = "active" | "inactive" | "pending" | "blacklisted";

export interface Guarantor {
  fullName: string;
  phoneNumber: string;
  email: string;
  relationship: string;
}

export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  status: UserStatus;
  tier: 1 | 2 | 3;
  accountBalance: number;
  accountNumber: string;
  bankName: string;
  profile: {
   firstName: string;
   lastName: string;
   gender: string;
   bvn: number;
   maritalStatus: string;
   children: number;
   typeOfResidence: string
  };
  education: {
    level: string;
    employmentStatus: string;
    sector: string;
    durationOfEmployment: string;
    officeEmail: string;
    monthlyIncome: [number, number];
    loanRepayment: number;
  };
  socials: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  guarantors: Guarantor[];
}
