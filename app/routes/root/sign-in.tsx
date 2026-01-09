import { Link, redirect } from "react-router";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";
import { useState, useEffect } from "react";

/* -----------------------------------------------------
   CLIENT LOADER (SAFE FOR GUESTS)
----------------------------------------------------- */
export async function clientLoader() {
  try {
    const user = await account.get();

    if (user?.$id) {
      return redirect("/");
    }
  } catch {
    // User is not logged in — this is expected
  }

  return null;
}

/* -----------------------------------------------------
   COMPONENT
----------------------------------------------------- */
const SignIn = () => {
  const [mounted, setMounted] = useState(false);
  const [ButtonComponent, setButtonComponent] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    import("@syncfusion/ej2-react-buttons").then((module) => {
      setButtonComponent(() => module.ButtonComponent);
    });
  }, []);

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
            <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
          </header>

          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>

            <p className="p-18-regular text-center text-gray-100 !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>

          {mounted && ButtonComponent ? (
            <ButtonComponent
              type="button"
              className="button-class !h-11 !w-full"
              onClick={loginWithGoogle}
            >
              <img
                src="/assets/icons/google.svg"
                className="size-5"
                alt="google"
              />
              <span className="p-18-semibold text-white">
                Sign in with Google
              </span>
            </ButtonComponent>
          ) : (
            <button
              type="button"
              className="button-class !h-11 !w-full flex items-center justify-center gap-2"
              onClick={loginWithGoogle}
            >
              <img
                src="/assets/icons/google.svg"
                className="size-5"
                alt="google"
              />
              <span className="p-18-semibold text-white">
                Sign in with Google
              </span>
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default SignIn;
