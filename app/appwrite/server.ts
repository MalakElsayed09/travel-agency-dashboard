import { Client, Databases } from "node-appwrite";

const endpoint = process.env.APPWRITE_API_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  throw new Error("Missing server Appwrite env variables");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

export const database = new Databases(client);
