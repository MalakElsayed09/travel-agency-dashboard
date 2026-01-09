export type Trip = {
  name: string;
  description: string;
  estimatedPrice: string;
  duration: number;
  budget: string;
  travelStyle: string;
  country: string;
  interests: string[];
  groupType: string;
  bestTimeToVisit: string[];
  weatherInfo: string[];
  location: {
    city: string;
    coordinates: [number, number];
    openStreetMap: string;
  };
  itinerary: any[];
};

export type TrendResult = {
  trend: "increment" | "decrement" | "no change";
  percentage: number;
};

export type TripFormData = {
  country: string;
  numberOfDays: number;
  travelStyle: string;
  interests: string[];
  budget: string;
  groupType: string;
};
