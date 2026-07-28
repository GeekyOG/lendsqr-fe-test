import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@/types/user";
import Users from "./Users";

vi.mock("@/services/users", () => ({
  fetchUsers: vi.fn(),
  getUserStats: vi.fn(),
  getOrganizations: vi.fn(),
  updateUserStatus: vi.fn(),
}));

import { fetchUsers, getUserStats, getOrganizations, updateUserStatus } from "@/services/users";

const mockedFetchUsers = vi.mocked(fetchUsers);
const mockedGetUserStats = vi.mocked(getUserStats);
const mockedGetOrganizations = vi.mocked(getOrganizations);
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
    tier: 1,
    accountBalance: 200000,
    accountNumber: "1234567890",
    bankName: "Providus Bank",
    profile: {
      firstName: "Adedeji",
      lastName: "Adebayo",
      bvn: 12345678901,
      gender: "male",
      maritalStatus: "Single",
      children: 0,
      typeOfResidence: "Parent's Apartment",
    },
    education: {
      level: "B.Sc",
      employmentStatus: "Employed",
      sector: "FinTech",
      durationOfEmployment: "2 years",
      officeEmail: "adedeji@lendsqr.com",
      monthlyIncome: [200000, 400000],
      loanRepayment: 40000,
    },
    socials: { twitter: "@adedeji", facebook: "Adedeji", instagram: "@adedeji" },
    guarantors: [],
    ...overrides,
  };
}

function renderUsers() {
  return render(
    <MemoryRouter>
      <Users />
    </MemoryRouter>,
  );
}

const STATS = { totalUsers: 500, activeUsers: 200, usersWithLoans: 100, usersWithSavings: 300 };

beforeEach(() => {
  mockedGetUserStats.mockResolvedValue(STATS);
  mockedGetOrganizations.mockResolvedValue(["Lendsqr", "Lendstar"]);
});

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("Users page", () => {
  it("shows a loading state before the users resolve", async () => {
    mockedFetchUsers.mockReturnValue(new Promise(() => {}));
    renderUsers();

    expect(screen.getByText("Loading users…")).toBeInTheDocument();
    await act(async () => {});
  });

  it("renders stats and table rows once users load", async () => {
    mockedFetchUsers.mockResolvedValue({ data: [buildUser()], total: 1 });
    renderUsers();

    expect(await screen.findByText("Adedeji")).toBeInTheDocument();
    expect(await screen.findByText("500")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("shows an empty state with no matching rows", async () => {
    mockedFetchUsers.mockResolvedValue({ data: [], total: 0 });
    renderUsers();

    expect(await screen.findByText("No users match your filters.")).toBeInTheDocument();
  });

  it("shows an error state and retries on demand", async () => {
    const user = userEvent.setup();
    mockedFetchUsers.mockRejectedValueOnce(new Error("network down"));
    renderUsers();

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);

    mockedFetchUsers.mockResolvedValueOnce({ data: [buildUser()], total: 1 });
    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Adedeji")).toBeInTheDocument();
  });

  it("persists the selected user and updates status from the row action menu", async () => {
    const user = userEvent.setup();
    const record = buildUser();
    mockedFetchUsers.mockResolvedValue({ data: [record], total: 1 });
    mockedUpdateUserStatus.mockResolvedValue({ ...record, status: "blacklisted" });

    renderUsers();
    await screen.findByText("Adedeji");

    await user.click(screen.getByRole("button", { name: "Actions for Adedeji" }));
    const menu = screen.getByRole("menu");

    await user.click(within(menu).getByRole("menuitem", { name: "View Details" }));
    expect(localStorage.getItem(`lendsqr_user_${record.id}`)).toContain(record.email);

    await user.click(screen.getByRole("button", { name: "Actions for Adedeji" }));
    await user.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Blacklist User" }));

    expect(mockedUpdateUserStatus).toHaveBeenCalledWith(record.id, "blacklisted");
    await waitFor(() => expect(screen.getByText("Blacklisted")).toBeInTheDocument());
  });

  it("applies a filter and requests a fresh page from the service", async () => {
    const user = userEvent.setup();
    mockedFetchUsers.mockResolvedValue({ data: [buildUser()], total: 1 });
    renderUsers();
    await screen.findByText("Adedeji");

    await user.click(screen.getAllByRole("button", { name: "Show filters" })[0]);
    await user.selectOptions(screen.getByLabelText("Organization"), "Lendstar");
    await user.click(screen.getByRole("button", { name: "Apply filters" }));

    await waitFor(() =>
      expect(mockedFetchUsers).toHaveBeenLastCalledWith(
        expect.objectContaining({ filters: { organization: "Lendstar" } }),
      ),
    );
  });
});
