import { appwriteConfig, database } from "~/appwrite/client";
import { Query } from "appwrite";

export const getAllTrips = async (limit: number, offset: number) => {
  const response = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripsCollectionId,
    [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc("$createdAt"),
    ]
  );

  return {
    allTrips: response.documents,
    total: response.total,
  };
};

export const getTripById = async (tripId: string) => {
  return await database.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.tripsCollectionId,
    tripId
  );
};
