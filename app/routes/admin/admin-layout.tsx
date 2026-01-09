import { Outlet, redirect } from "react-router";
import { useEffect, useState } from "react";

import { MobileSidebar, NavItems } from "../../../components";
import {
  getExistingUser,
  storeUserData,
  getSafeAccountUser,
} from "~/appwrite/auth";

/* -----------------------------------------------------
   CLIENT LOADER (ADMIN PROTECTION)
----------------------------------------------------- */
export async function clientLoader() {
  try {
    // ✅ SAFE: does not throw for guests
    const user = await getSafeAccountUser();

    if (!user) {
      throw redirect("/sign-in");
    }

    const existingUser = await getExistingUser(user.$id);

    // 🚫 Block non-admin users
    if (existingUser && existingUser.status === "user") {
      throw redirect("/");
    }

    // ✅ First-time OAuth login
    if (!existingUser) {
      const createdUser = await storeUserData();
      return createdUser;
    }

    return existingUser;
  } catch (error) {
    console.error("Admin loader error:", error);
    throw redirect("/sign-in");
  }
}

/* -----------------------------------------------------
   ADMIN LAYOUT
----------------------------------------------------- */
const AdminLayout = () => {
  const [SidebarComponent, setSidebarComponent] =
    useState<React.ComponentType<any> | null>(null);

  // ✅ Client-only Syncfusion import (SSR-safe)
  useEffect(() => {
    import("@syncfusion/ej2-react-navigations").then((mod) => {
      setSidebarComponent(() => mod.SidebarComponent);
    });
  }, []);

  return (
    <div className="admin-layout">
      <MobileSidebar />

      <aside className="w-full max-w-[270px] hidden lg:block">
        {SidebarComponent && (
          <SidebarComponent width={270} enableGestures={false}>
            <NavItems />
          </SidebarComponent>
        )}
      </aside>

      <main className="children">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
