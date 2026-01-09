import { Outlet, redirect } from "react-router";
import { getExistingUser, storeUserData } from "~/appwrite/auth";
import { account } from "~/appwrite/client";
import RootNavbar from "../../../components/RootNavbar";

/* -----------------------------------------------------
   CLIENT LOADER (AUTH-SAFE)
----------------------------------------------------- */
export async function clientLoader() {
  try {
    const user = await account.get();

    if (!user?.$id) {
      return redirect("/sign-in");
    }

    const existingUser = await getExistingUser(user.$id);

    if (existingUser?.$id) {
      return existingUser;
    }

    await storeUserData();
    return null;
  } catch {
    // Guest user or expired session
    return redirect("/sign-in");
  }
}

/* -----------------------------------------------------
   LAYOUT
----------------------------------------------------- */
const PageLayout = () => {
  return (
    <div className="bg-light-200 min-h-screen">
      <RootNavbar />
      <Outlet />
    </div>
  );
};

export default PageLayout;
