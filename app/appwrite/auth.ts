import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "~/appwrite/client";

/* -----------------------------------------------------
   SAFE ACCOUNT GUARD (prevents guest scope errors)
----------------------------------------------------- */
export const getSafeAccountUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

/* -----------------------------------------------------
   GET EXISTING USER FROM DB
----------------------------------------------------- */
export const getExistingUser = async (accountId: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", accountId)]
    );

    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

/* -----------------------------------------------------
   STORE USER DATA AFTER OAUTH
----------------------------------------------------- */
export const storeUserData = async () => {
  try {
    const user = await getSafeAccountUser();
    if (!user) return null;

    const session = await account.getSession("current").catch(() => null);

    let imageUrl = null;
    if (session?.providerAccessToken) {
      imageUrl = await getGooglePicture(session.providerAccessToken);
    }

    return await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl,
        joinedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error storing user data:", error);
    return null;
  }
};

/* -----------------------------------------------------
   FETCH GOOGLE PROFILE PICTURE
----------------------------------------------------- */
const getGooglePicture = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) return null;

    const { photos } = await response.json();
    return photos?.[0]?.url ?? null;
  } catch (error) {
    console.error("Error fetching Google picture:", error);
    return null;
  }
};

/* -----------------------------------------------------
   LOGIN WITH GOOGLE
----------------------------------------------------- */
export const loginWithGoogle = async () => {
  await account.createOAuth2Session(
    OAuthProvider.Google,
    window.location.origin,
    `${window.location.origin}/404`
  );
};

/* -----------------------------------------------------
   LOGOUT USER
----------------------------------------------------- */
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/* -----------------------------------------------------
   GET LOGGED-IN USER (DB RECORD)
----------------------------------------------------- */
export const getUser = async () => {
  try {
    const user = await getSafeAccountUser();
    if (!user) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );

    return documents[0] ?? null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

/* -----------------------------------------------------
   GET ALL USERS (ADMIN / DASHBOARD)
----------------------------------------------------- */
export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.limit(limit), Query.offset(offset)]
    );

    return { users: documents, total };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], total: 0 };
  }
};
