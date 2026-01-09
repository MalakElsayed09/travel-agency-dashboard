import React, { useEffect, useState } from "react";
import { Link, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/payment-success";
import confetti from "canvas-confetti";
import { LEFT_CONFETTI, RIGHT_CONFETTI } from "~/constants";

export async function loader({ params }: LoaderFunctionArgs) {
  return params;
}

const PaymentSuccess = ({ loaderData }: Route.ComponentProps) => {
  const [mounted, setMounted] = useState(false);
  const [ButtonComponent, setButtonComponent] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    confetti(LEFT_CONFETTI);
    confetti(RIGHT_CONFETTI);

    import("@syncfusion/ej2-react-buttons").then((module) => {
      setButtonComponent(() => module.ButtonComponent);
    });
  }, []);

  return (
    <main className="payment-success wrapper">
      <section>
        <article>
          <img src="/assets/icons/check.svg" className="size-24" />
          <h1>Thank & Welcome Aboard!</h1>

          <p>
            Your trip is booked - can't wait to have you on this adventure. Get
            ready to explore & make memories! ✨
          </p>

          <Link to={`/travel/${loaderData?.tripId}`} className="w-full">
            {mounted && ButtonComponent ? (
              <ButtonComponent className="button-class !h-11 !w-full">
                <img
                  src="/assets/icons/itinerary-button.svg"
                  className="size-5"
                />
                <span className="p-16-semibold text-white">
                  View trip details
                </span>
              </ButtonComponent>
            ) : (
              <button className="button-class !h-11 !w-full flex items-center justify-center gap-2">
                <img
                  src="/assets/icons/itinerary-button.svg"
                  className="size-5"
                />
                <span className="p-16-semibold text-white">
                  View trip details
                </span>
              </button>
            )}
          </Link>

          <Link to={"/"} className="w-full">
            {mounted && ButtonComponent ? (
              <ButtonComponent className="button-class-secondary !h-11 !w-full">
                <img src="/assets/icons/arrow-left.svg" className="size-5" />
                <span className="p-16-semibold">Return to homepage</span>
              </ButtonComponent>
            ) : (
              <button className="button-class-secondary !h-11 !w-full flex items-center justify-center gap-2">
                <img src="/assets/icons/arrow-left.svg" className="size-5" />
                <span className="p-16-semibold">Return to homepage</span>
              </button>
            )}
          </Link>
        </article>
      </section>
    </main>
  );
};
