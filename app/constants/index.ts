
export const sidebarItems = [
  {
    id: 1,
    href: "/dashboard",
    icon: "/assets/icons/dashboard.svg",
    label: "Dashboard",
  },
  {
    id: 2,
    href: "/all-users",
    icon: "/assets/icons/users.svg",
    label: "All Users",
  },
  {
    id: 3,
    href: "/trips",
    icon: "/assets/icons/trips.svg",
    label: "AI Trips",
  },
];

export const selectItems = [
  { key: "groupType" },
  { key: "travelStyle" },
  { key: "interest" },
  { key: "budget" },
];

export const comboBoxItems: Record<string, string[]> = {
  groupType: ["Solo", "Couple", "Family", "Friends", "Business"],
  travelStyle: ["Relaxed", "Luxury", "Adventure", "Cultural", "Budget"],
  interest: ["Historical Sites", "Nature", "Food & Dining", "Shopping", "Museums", "Beaches"],
  budget: ["Low", "Medium", "High", "Luxury"],
};