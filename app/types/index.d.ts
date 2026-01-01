declare global {
  interface StatsCard {
    headerTitle: string;
    total: number;
    lastMonthCount: number;
    currentMonthCount: number;
  }

  interface User {
    $id: string;
    name: string;
    email: string;
    imageURL?: string;
    status: "user" | "admin";
    joinedAt: string;
  }

  interface UserData {
    $id: string;
    name: string;
    email: string;
    imageURL?: string;
    status: "user" | "admin";
    joinedAt: string;
  }

  interface TripFormData {
    country: string;
    duration: number;
    travelStyle: string;
    interest: string;
    budget: string;
    groupType: string;
  }

  interface TripCardProps {
    id: string;
    name: string;
    location: string;
    imageURL: string;
    tags: string[];
    price: string;
  }

  interface CreateTripResponse {
    id: string;
  }
}

export {};