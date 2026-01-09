const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const TRIP_COLLECTION_ID = process.env.APPWRITE_TRIPS_COLLECTION_ID;

if (!DATABASE_ID || !TRIP_COLLECTION_ID) {
  throw new Error("Missing Appwrite database configuration");
}

import type { ActionFunctionArgs } from "react-router";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {parseMarkdownToJson, parseTripData} from "~/lib/utils";
import { database } from "~/appwrite/server";
import {ID} from "appwrite";
import {createProduct} from "~/lib/stripe.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId,
    } = await request.json();

    const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENAI_API_KEY!
);

    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    try {
        const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interests}'
        TravelStyle: '${travelStyle}'
        GroupType: '${groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${numberOfDays},
        "budget": "${budget}",
        "travelStyle": "${travelStyle}",
        "country": "${country}",
        "interests": ${interests},
        "groupType": "${groupType}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [latitude, longitude],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        },
        ...
        ]
    }`;

        const textResult = await genAI
            .getGenerativeModel({ model: 'gemini-2.0-flash' })
            .generateContent([prompt])

        const trip = parseMarkdownToJson(textResult.response.text());

        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`
        );

        const imageUrls = (await imageResponse.json()).results.slice(0, 3)
            .map((result: any) => result.urls?.regular || null);

        const result = await database.createDocument(
  DATABASE_ID,
  TRIP_COLLECTION_ID,
  ID.unique(),
  {
    tripDetails: JSON.stringify(trip),
    createdAt: new Date().toISOString(),
    imageUrls,
    userId,
  }
)

        const tripDetail = parseTripData(result.tripDetails) as Trip;
        const tripPrice = parseInt(tripDetail.estimatedPrice.replace('$', ''), 10)
        const paymentLink = await createProduct(
            tripDetail.name,
            tripDetail.description,
            imageUrls,
            tripPrice,
            result.$id
        );

       await database.updateDocument(
  DATABASE_ID,
  TRIP_COLLECTION_ID,
  result.$id,
  {
    payment_link: paymentLink.url,
  }
);


        return new Response(
  JSON.stringify({ id: result.$id }),
  {
    headers: { "Content-Type": "application/json" },
  }
);

    } catch (e) {
        console.error('Error generating travel plan: ', e);
    }
}
console.log({
  hasGemini: !!process.env.GOOGLE_GENAI_API_KEY,
  hasUnsplash: !!process.env.UNSPLASH_ACCESS_KEY,
});
