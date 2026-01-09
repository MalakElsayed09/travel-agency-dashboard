

export const sidebarItems = [
  {
    id: 1,
    icon: "/assets/icons/home.svg",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: 3,
    icon: "/assets/icons/users.svg",
    label: "All Users",
    href: "/all-users",
  },
  {
    id: 4,
    icon: "/assets/icons/itinerary.svg",
    label: "AI Trips",
    href: "/trips",
  },
];

export const chartOneData = [
  { x: "Jan", y1: 0.5, y2: 1.5, y3: 0.7 },
  { x: "Feb", y1: 0.8, y2: 1.2, y3: 0.9 },
  { x: "Mar", y1: 1.2, y2: 1.8, y3: 1.5 },
  { x: "Apr", y1: 1.5, y2: 2.0, y3: 1.8 },
  { x: "May", y1: 1.8, y2: 2.5, y3: 2.0 },
  { x: "Jun", y1: 2.0, y2: 2.8, y3: 2.5 },
];

export const travelStyles = [
  "Relaxed",
  "Luxury",
  "Adventure",
  "Cultural",
  "Nature & Outdoors",
  "City Exploration",
];

export const interests = [
  "Food & Culinary",
  "Historical Sites",
  "Hiking & Nature Walks",
  "Beaches & Water Activities",
  "Museums & Art",
  "Nightlife & Bars",
  "Photography Spots",
  "Shopping",
  "Local Experiences",
];

export const budgetOptions = ["Budget", "Mid-range", "Luxury", "Premium"];
export const groupTypes = ["Solo", "Couple", "Family", "Friends", "Business"];
export const footers = ["Terms & Condition", "Privacy Policy"];

export const selectItems = [
  "groupType",
  "travelStyle",
  "interest",
  "budget",
] as (keyof TripFormData)[];

export const comboBoxItems = {
  groupType: groupTypes,
  travelStyle: travelStyles,
  interest: interests,
  budget: budgetOptions,
} as Record<keyof TripFormData, string[]>;

/* ✅ AXIS CONFIGS — PLAIN OBJECTS ONLY */
export const userXAxis = {
  valueType: "Category",
  title: "Day",
};

export const useryAxis = {
  minimum: 0,
  maximum: 10,
  interval: 2,
  title: "Count",
};

export const tripXAxis = {
  valueType: "Category",
  title: "Travel Styles",
  majorGridLines: { width: 0 },
};

export const tripyAxis = {
  minimum: 0,
  maximum: 10,
  interval: 2,
  title: "Count",
};

export const CONFETTI_SETTINGS = {
  particleCount: 200,
  spread: 60,
  colors: ["#ff0", "#ff7f00", "#ff0044", "#4c94f4", "#f4f4f4"],
  decay: 0.95,
};

export const LEFT_CONFETTI = {
  ...CONFETTI_SETTINGS,
  angle: 45,
  origin: { x: 0, y: 1 },
};

export const RIGHT_CONFETTI = {
  ...CONFETTI_SETTINGS,
  angle: 135,
  origin: { x: 1, y: 1 },
};
