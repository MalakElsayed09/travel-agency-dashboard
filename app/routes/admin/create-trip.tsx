import { Header } from "../../../components";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import React, { useState, useEffect } from "react";
import { world_map } from "~/constants/world_map";
import { useNavigate } from "react-router";
import { getSafeAccountUser } from "~/appwrite/auth";

/* -----------------------------------------------------
   LOADER
----------------------------------------------------- */
export const loader = async () => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();

  return data.map((country: any) => ({
    name: country.flag + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};

/* -----------------------------------------------------
   COMPONENT
----------------------------------------------------- */
const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [SyncfusionComponents, setSyncfusionComponents] = useState<any>(null);

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* -----------------------------------------------------
     CLIENT-ONLY SYNCFUSION LOAD
  ----------------------------------------------------- */
  useEffect(() => {
    setMounted(true);

    Promise.all([
      import("@syncfusion/ej2-react-dropdowns"),
      import("@syncfusion/ej2-react-maps"),
      import("@syncfusion/ej2-react-buttons"),
    ]).then(([dropdowns, maps, buttons]) => {
      setSyncfusionComponents({
        ComboBoxComponent: dropdowns.ComboBoxComponent,
        MapsComponent: maps.MapsComponent,
        LayersDirective: maps.LayersDirective,
        LayerDirective: maps.LayerDirective,
        ButtonComponent: buttons.ButtonComponent,
      });
    });
  }, []);

  /* -----------------------------------------------------
     FORM HANDLERS
  ----------------------------------------------------- */
  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.country ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget ||
      !formData.groupType
    ) {
      setError("Please provide values for all fields");
      setLoading(false);
      return;
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setError("Duration must be between 1 and 10 days");
      setLoading(false);
      return;
    }

    // ✅ SAFE AUTH CHECK
    const user = await getSafeAccountUser();
    if (!user) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      const result: CreateTripResponse = await response.json();

      if (result?.id) {
        navigate(`/trips/${result.id}`);
      } else {
        setError("Failed to generate a trip");
      }
    } catch (err) {
      console.error("Error generating trip", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------
     MAP + DROPDOWN DATA
  ----------------------------------------------------- */
  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((c) => c.name === formData.country)?.coordinates || [],
    },
  ];

  /* -----------------------------------------------------
     LOADING STATE
  ----------------------------------------------------- */
  if (!mounted || !SyncfusionComponents) {
    return (
      <main className="flex flex-col gap-10 pb-20 wrapper">
        <Header
          title="Add a New Trip"
          description="View and edit AI Generated travel plans"
        />
        <div className="flex items-center justify-center p-10">
          <p className="text-gray-500">Loading form...</p>
        </div>
      </main>
    );
  }

  const {
    ComboBoxComponent,
    MapsComponent,
    LayersDirective,
    LayerDirective,
    ButtonComponent,
  } = SyncfusionComponents;

  /* -----------------------------------------------------
     RENDER
  ----------------------------------------------------- */
  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />

      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a Country"
              allowFiltering
              className="combo-box"
              change={(e: { value?: string }) =>
                e.value && handleChange("country", e.value)
              }
              filtering={(e: any) =>
                e.updateData(
                  countries
                    .filter((c) =>
                      c.name.toLowerCase().includes(e.text.toLowerCase())
                    )
                    .map((c) => ({ text: c.name, value: c.value }))
                )
              }
            />
          </div>

          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="number"
              className="form-input"
              placeholder="Enter number of days"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select ${formatKey(key)}`}
                allowFiltering
                className="combo-box"
                change={(e: { value?: string }) =>
                  e.value && handleChange(key, e.value)
                }
              />
            </div>
          ))}

          <div>
            <label>Location on the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{
                    colorValuePath: "color",
                    fill: "#E5E5E5",
                  }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          {error && <p className="error">{error}</p>}

          <footer className="px-6">
            <ButtonComponent
              type="submit"
              disabled={loading}
              className="button-class !h-12 !w-full"
            >
              <img
                src={`/assets/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                className={cn("size-5", { "animate-spin": loading })}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
