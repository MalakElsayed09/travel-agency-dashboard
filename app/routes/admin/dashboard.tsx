import type { Route } from "./+types/dashboard";

export async function clientLoader() {
  return { message: "Dashboard loaded" };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <main className="dashboard wrapper">
      <h1 className="text-4xl font-bold">Welcome to Dashboard! 🎉</h1>
      <p className="text-lg mt-4">Authentication is working!</p>
    </main>
  );
}
