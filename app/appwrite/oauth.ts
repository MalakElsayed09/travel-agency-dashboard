import { account, database, appwriteConfig } from "./client";
import { OAuthProvider, Query, ID } from "appwrite";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/sign-in`
    );
  } catch (error) {
    console.error("Login with Google error:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) return redirect("/sign-in");

    const { documents: users } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountID", user.$id)]
    );

    return users[0] || null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

export const storeUserData = async (user: any) => {
  try {
    const existingUser = await getExistingUser(user.$id);
    if (existingUser) return existingUser;

    const imageURL = user.prefs?.picture || "";

    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountID: user.$id,
        email: user.email,
        name: user.name,
        imageURL: imageURL,
        joinedAt: new Date().toISOString(),
        status: "admin", // First user is admin
      }
    );

    return newUser;
  } catch (error) {
    console.error("Store user data error:", error);
    throw error;
  }
};

export const getExistingUser = async (accountID: string) => {
  try {
    const { documents: users } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountID", accountID)]
    );

    return users[0] || null;
  } catch (error) {
    console.error("Get existing user error:", error);
    return null;
  }
};