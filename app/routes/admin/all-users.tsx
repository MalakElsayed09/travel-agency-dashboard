import { Header } from "../../../components";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";
import { useState, useEffect } from "react";

export const loader = async () => {
  const { users, total } = await getAllUsers(10, 0);

  return { users, total };
};

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
  const { users } = loaderData;
  const [mounted, setMounted] = useState(false);
  const [GridComponents, setGridComponents] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import("@syncfusion/ej2-react-grids").then((module) => {
      setGridComponents({
        GridComponent: module.GridComponent,
        ColumnsDirective: module.ColumnsDirective,
        ColumnDirective: module.ColumnDirective,
      });
    });
  }, []);

  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, sort, and access detailed user profiles"
      />

      {mounted && GridComponents ? (
        <GridComponents.GridComponent dataSource={users} gridLines="None">
          <GridComponents.ColumnsDirective>
            <GridComponents.ColumnDirective
              field="name"
              headerText="Name"
              width="200"
              textAlign="Left"
              template={(props: UserData) => (
                <div className="flex items-center gap-1.5 px-4">
                  <img
                    src={props.imageUrl}
                    alt="user"
                    className="rounded-full size-8 aspect-square"
                    referrerPolicy="no-referrer"
                  />
                  <span>{props.name}</span>
                </div>
              )}
            />
            <GridComponents.ColumnDirective
              field="email"
              headerText="Email Address"
              width="200"
              textAlign="Left"
            />
            <GridComponents.ColumnDirective
              field="joinedAt"
              headerText="Date Joined"
              width="140"
              textAlign="Left"
              template={({ joinedAt }: { joinedAt: string }) =>
                formatDate(joinedAt)
              }
            />
            <GridComponents.ColumnDirective
              field="status"
              headerText="Type"
              width="100"
              textAlign="Left"
              template={({ status }: UserData) => (
                <article
                  className={cn(
                    "status-column",
                    status === "user" ? "bg-success-50" : "bg-light-300"
                  )}
                >
                  <div
                    className={cn(
                      "size-1.5 rounded-full",
                      status === "user" ? "bg-success-500" : "bg-gray-500"
                    )}
                  />
                  <h3
                    className={cn(
                      "font-inter text-xs font-medium",
                      status === "user" ? "text-success-700" : "text-gray-500"
                    )}
                  >
                    {status}
                  </h3>
                </article>
              )}
            />
          </GridComponents.ColumnsDirective>
        </GridComponents.GridComponent>
      ) : (
        <div className="flex items-center justify-center p-10">
          <p className="text-gray-500">Loading users table...</p>
        </div>
      )}
    </main>
  );
};

export default AllUsers;
