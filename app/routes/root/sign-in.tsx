import { Link, redirect } from "react-router";
import { loginWithGoogle } from "~/appwrite/oauth";
import { account } from "~/appwrite/client";
import type { Route } from "./+types/sign-in";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (user?.$id) return redirect("/dashboard");
    return null;
  } catch {
    return null;
  }
}

export default function SignIn({ loaderData }: Route.ComponentProps) {
  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className="p28-bold text-dark-100">Tour Visto</h1>
          </header>

          <article>
            <h2 className="p28-semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>
            <p className="p18-regular text-center text-gray-100 !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease
            </p>
          </article>

          <button
            onClick={loginWithGoogle}
            type="button"
            className="button-class !h-11 !w-full flex items-center justify-center gap-2"
          >
            <img
              src="/assets/icons/google.svg"
              alt="Google"
              className="size-5"
            />
            <span className="p18-semibold text-white">Sign in with Google</span>
          </button>
        </div>
      </section>
    </main>
  );
}
