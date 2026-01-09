import { Header, StatsCard, TripCard } from "../../../components";
import { getAllUsers, getUser } from "~/appwrite/auth";
import type { Route } from "./+types/dashboard";

import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trip";
import { parseTripData } from "~/lib/utils";

import { useEffect, useState } from "react";
import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants";

/* ---------------- LOADER ---------------- */

export const clientLoader = async () => {
  const [
    user,
    dashboardStats,
    trips,
    userGrowth,
    tripsByTravelStyle,
    allUsers,
  ] = await Promise.all([
    getUser(),
    getUsersAndTripsStats(),
    getAllTrips(4, 0),
    getUserGrowthPerDay(),
    getTripsByTravelStyle(),
    getAllUsers(4, 0),
  ]);

  const allTrips = trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
    id: $id,
    ...parseTripData(tripDetails),
    imageUrls: imageUrls ?? [],
  }));

  const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
    imageUrl: user.imageUrl,
    name: user.name,
    count: user.itineraryCount ?? Math.floor(Math.random() * 10),
  }));

  return {
    user,
    dashboardStats,
    allTrips,
    userGrowth,
    tripsByTravelStyle,
    allUsers: mappedUsers,
  };
};

type DashboardLoaderData = {
  user: User | null;
  dashboardStats: any;
  allTrips: any[];
  userGrowth: any[];
  tripsByTravelStyle: any[];
  allUsers: UsersItineraryCount[];
};

/* ---------------- COMPONENT ---------------- */

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const [mounted, setMounted] = useState(false);
  const [Syncfusion, setSyncfusion] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    Promise.all([
      import("@syncfusion/ej2-react-charts"),
      import("@syncfusion/ej2-react-grids"),
    ]).then(([chartsPkg, gridsPkg]) => {
      const charts = chartsPkg.default ?? chartsPkg;
      const grids = gridsPkg.default ?? gridsPkg;

      setSyncfusion({
        ChartComponent: charts.ChartComponent,
        SeriesCollectionDirective: charts.SeriesCollectionDirective,
        SeriesDirective: charts.SeriesDirective,
        ColumnSeries: charts.ColumnSeries,
        SplineAreaSeries: charts.SplineAreaSeries,
        Tooltip: charts.Tooltip,
        Category: charts.Category,
        DataLabel: charts.DataLabel,
        ChartInject: charts.Inject,

        GridComponent: grids.GridComponent,
        ColumnsDirective: grids.ColumnsDirective,
        ColumnDirective: grids.ColumnDirective,
      });
    });
  }, []);

  const data = loaderData as unknown as DashboardLoaderData;
  const {
    user,
    dashboardStats,
    allTrips,
    userGrowth,
    tripsByTravelStyle,
    allUsers,
  } = data;

  const trips = allTrips.map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));

  const usersAndTrips = [
    {
      title: "Latest user signups",
      dataSource: allUsers,
      field: "count",
      headerText: "Trips created",
    },
    {
      title: "Trips based on interests",
      dataSource: trips,
      field: "interest",
      headerText: "Interests",
    },
  ];

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? "Guest"} 👋`}
        description="Track activity, trends and popular destinations in real time"
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          headerTitle="Total Users"
          total={dashboardStats.totalUsers}
          currentMonthCount={dashboardStats.usersJoined.currentMonth}
          lastMonthCount={dashboardStats.usersJoined.lastMonth}
        />
        <StatsCard
          headerTitle="Total Trips"
          total={dashboardStats.totalTrips}
          currentMonthCount={dashboardStats.tripsCreated.currentMonth}
          lastMonthCount={dashboardStats.tripsCreated.lastMonth}
        />
        <StatsCard
          headerTitle="Active Users"
          total={dashboardStats.userRole.total}
          currentMonthCount={dashboardStats.userRole.currentMonth}
          lastMonthCount={dashboardStats.userRole.lastMonth}
        />
      </section>

      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id.toString()}
              name={trip.name}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests, trip.travelStyle]}
              price={trip.estimatedPrice}
            />
          ))}
        </div>
      </section>

      {/* CLIENT ONLY – SYNCFUSION */}
      {mounted && Syncfusion && (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Syncfusion.ChartComponent
              id="user-growth"
              primaryXAxis={userXAxis}
              primaryYAxis={useryAxis}
              title="User Growth"
              tooltip={{ enable: true }}
            >
              <Syncfusion.ChartInject
                services={[
                  Syncfusion.ColumnSeries,
                  Syncfusion.SplineAreaSeries,
                  Syncfusion.Category,
                  Syncfusion.DataLabel,
                  Syncfusion.Tooltip,
                ]}
              />
              <Syncfusion.SeriesCollectionDirective>
                <Syncfusion.SeriesDirective
                  dataSource={userGrowth}
                  xName="day"
                  yName="count"
                  type="Column"
                  columnWidth={0.3}
                />
                <Syncfusion.SeriesDirective
                  dataSource={userGrowth}
                  xName="day"
                  yName="count"
                  type="SplineArea"
                />
              </Syncfusion.SeriesCollectionDirective>
            </Syncfusion.ChartComponent>

            <Syncfusion.ChartComponent
              id="trip-trends"
              primaryXAxis={tripXAxis}
              primaryYAxis={tripyAxis}
              title="Trip Trends"
              tooltip={{ enable: true }}
            >
              <Syncfusion.ChartInject
                services={[
                  Syncfusion.ColumnSeries,
                  Syncfusion.Category,
                  Syncfusion.DataLabel,
                  Syncfusion.Tooltip,
                ]}
              />
              <Syncfusion.SeriesCollectionDirective>
                <Syncfusion.SeriesDirective
                  dataSource={tripsByTravelStyle}
                  xName="travelStyle"
                  yName="count"
                  type="Column"
                  columnWidth={0.3}
                />
              </Syncfusion.SeriesCollectionDirective>
            </Syncfusion.ChartComponent>
          </section>

          <section className="user-trip wrapper">
            {usersAndTrips.map(
              ({ title, dataSource, field, headerText }, i) => (
                <div key={i} className="flex flex-col gap-5">
                  <h3 className="p-20-semibold text-dark-100">{title}</h3>

                  <Syncfusion.GridComponent
                    dataSource={dataSource}
                    gridLines="None"
                  >
                    <Syncfusion.ColumnsDirective>
                      <Syncfusion.ColumnDirective
                        field="name"
                        headerText="Name"
                        width="200"
                        template={(props: UserData) => (
                          <div className="flex items-center gap-2 px-4">
                            <img
                              src={props.imageUrl}
                              className="rounded-full size-8"
                            />
                            <span>{props.name}</span>
                          </div>
                        )}
                      />
                      <Syncfusion.ColumnDirective
                        field={field}
                        headerText={headerText}
                        width="150"
                      />
                    </Syncfusion.ColumnsDirective>
                  </Syncfusion.GridComponent>
                </div>
              )
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;
