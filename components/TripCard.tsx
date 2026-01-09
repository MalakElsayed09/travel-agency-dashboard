import { Link, useLocation } from "react-router";
import { cn, getFirstWord } from "~/lib/utils";
import { useState, useEffect } from "react";

const TripCard = ({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) => {
  const path = useLocation();
  const [mounted, setMounted] = useState(false);
  const [ChipComponents, setChipComponents] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import("@syncfusion/ej2-react-buttons").then((module) => {
      setChipComponents({
        ChipListComponent: module.ChipListComponent,
        ChipsDirective: module.ChipsDirective,
        ChipDirective: module.ChipDirective,
      });
    });
  }, []);

  return (
    <Link
      to={
        path.pathname === "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className="trip-card"
    >
      <img src={imageUrl} alt={name} />

      <article>
        <h2>{name}</h2>
        <figure>
          <img
            src="/assets/icons/location-mark.svg"
            alt="location"
            className="size-4"
          />
          <figcaption>{location}</figcaption>
        </figure>
      </article>

      <div className="mt-5 pl-[18px] pr-3.5 pb-5">
        {mounted && ChipComponents ? (
          <ChipComponents.ChipListComponent id="travel-chip">
            <ChipComponents.ChipsDirective>
              {tags?.map((tag, index) => (
                <ChipComponents.ChipDirective
                  key={index}
                  text={getFirstWord(tag)}
                  cssClass={cn(
                    index === 1
                      ? "!bg-pink-50 !text-pink-500"
                      : "!bg-success-50 !text-success-700"
                  )}
                />
              ))}
            </ChipComponents.ChipsDirective>
          </ChipComponents.ChipListComponent>
        ) : (
          <div className="flex gap-2">
            {tags?.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "px-3 py-1 rounded-full text-xs",
                  index === 1
                    ? "bg-pink-50 text-pink-500"
                    : "bg-success-50 text-success-700"
                )}
              >
                {getFirstWord(tag)}
              </span>
            ))}
          </div>
        )}
      </div>

      <article className="tripCard-pill">{price}</article>
    </Link>
  );
};

export default TripCard;
