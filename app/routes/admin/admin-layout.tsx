import { Outlet, redirect } from "react-router";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/oauth";
import type { Route } from "./+types/admin-layout";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (!user?.$id) return redirect("/sign-in");

    const existingUser = await getExistingUser(user.$id);

    if (existingUser?.status === "user") {
      return redirect("/");
    }

    return existingUser?.$id ? existingUser : await storeUserData(user);
  } catch (error) {
    console.error("Error in client loader:", error);
    return redirect("/sign-in");
  }
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="admin-layout">
      <aside className="w-full max-w-[270px] hidden md:block">
        <div className="sidebar">Sidebar</div>
      </aside>

      <aside className="md:hidden">
        <div className="mobile-sidebar">Mobile Sidebar</div>
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
}
