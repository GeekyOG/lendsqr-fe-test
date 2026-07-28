import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { User } from "@/types/user";
import UserDetails from "./UserDetails";

vi.mock("@/services/users", () => ({
  getUserById: vi.fn(),
  updateUserStatus: vi.fn(),
}));

import { getUserById, updateUserStatus } from "@/services/users";

const mockedGetUserById = vi.mocked(getUserById);
const mockedUpdateUserStatus = vi.mocked(updateUserStatus);

function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: "USR-00001",
    organization: "Lendsqr",
    username: "Adedeji",
    email: "adedeji@lendsqr.com",
    phoneNumber: "08078903721",
    createdAt: "2020-05-15T10:00:00.000Z",
    status: "inactive",
    tier: 2,
    accountBalance: 200000,
    accountNumber: "9912345678",
    bankName: "Providus Bank",
    profile: {
      firstName: "Rhea",
      lastName: "Calhoun",
      gender: "female",
      bvn: 58798189426,
      maritalStatus: "Single",
      children: 1,
      typeOfResidence: "Mortgage"
    },
    education: {
      level: "B.Sc",
      employmentStatus: "Employed",
      sector: "FinTech",
      durationOfEmployment: "2 years",
      officeEmail: "grace@lendsqr.com",
      monthlyIncome: [200000, 400000],
      loanRepayment: 40000,
    },
    socials: { twitter: "@grace_effiom", facebook: "Grace Effiom", instagram: "@grace_effiom" },
    guarantors: [
      { fullName: "Debby Ogana", phoneNumber: "07060780922", email: "debby@gmail.com", relationship: "Sister" },
    ],
    ...overrides,
  };
}

function renderUserDetails(id = "USR-00001") {
  return render(
    <MemoryRouter initialEntries={[`/users/${id}`]}>
      <Routes>
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("UserDetails page", () => {
  it("renders general details for a known user", async () => {
    mockedGetUserById.mockResolvedValue(buildUser());
    renderUserDetails();

    expect(await screen.findByText("USR-00001")).toBeInTheDocument();
    expect(screen.getAllByText("Grace Effiom").length).toBeGreaterThan(0);
    expect(screen.getByText("₦200,000.00")).toBeInTheDocument();
    expect(screen.getAllByText("07060780922").length).toBeGreaterThan(0);
    expect(screen.getByText("Debby Ogana")).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown user", async () => {
    mockedGetUserById.mockResolvedValue(undefined);
    renderUserDetails("USR-99999");

    expect(await screen.findByText("User not found.")).toBeInTheDocument();
  });

  it("prefers a locally stored copy of the user over the service lookup", async () => {
    const stored = buildUser({ profile: { ...buildUser().profile, firstName: "Stored", lastName: "Name" } });
    localStorage.setItem("lendsqr_user_USR-00001", JSON.stringify(stored));
    mockedGetUserById.mockResolvedValue(buildUser());

    renderUserDetails();

    expect((await screen.findAllByText("Stored Name")).length).toBeGreaterThan(0);
    expect(mockedGetUserById).not.toHaveBeenCalled();
  });

  it("switches tabs and shows a placeholder for sections without data", async () => {
    const user = userEvent.setup();
    mockedGetUserById.mockResolvedValue(buildUser());
    renderUserDetails();

    await screen.findByText("USR-00001");
    expect(screen.getByText("Personal Information")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Documents" }));

    expect(screen.queryByText("Personal Information")).not.toBeInTheDocument();
    expect(screen.getByText("No documents information available yet.")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Documents" })).toHaveAttribute("aria-selected", "true");
  });

  it("moves tab selection with the right arrow key", async () => {
    const user = userEvent.setup();
    mockedGetUserById.mockResolvedValue(buildUser());
    renderUserDetails();

    await screen.findByText("USR-00001");
    screen.getByRole("tab", { name: "General Details" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Documents" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Documents" })).toHaveAttribute("aria-selected", "true");
  });

  it("blacklists the user and persists the change", async () => {
    const user = userEvent.setup();
    const record = buildUser();
    mockedGetUserById.mockResolvedValue(record);
    mockedUpdateUserStatus.mockResolvedValue({ ...record, status: "blacklisted" });

    renderUserDetails();
    await screen.findByText("USR-00001");

    await user.click(screen.getByRole("button", { name: "Blacklist User" }));

    expect(mockedUpdateUserStatus).toHaveBeenCalledWith("USR-00001", "blacklisted");
    expect(localStorage.getItem("lendsqr_user_USR-00001")).toContain("blacklisted");
  });
});
