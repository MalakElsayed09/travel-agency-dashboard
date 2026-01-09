import { Client, Account, Databases, Storage } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_API_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const tripsCollectionId = import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID;
const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

if (!endpoint || !projectId || !databaseId) {
  throw new Error("Missing Appwrite env variables");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);

export const appwriteConfig = {
  databaseId,
  tripsCollectionId,
  usersCollectionId,
};

export { client };
