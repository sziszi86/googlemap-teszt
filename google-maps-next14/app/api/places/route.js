import { NextResponse } from "next/server";

const fakeLocations = [
    {
        lat: 47.4979,
        lng: 19.0402,
        name: "Budapest, Deák Ferenc tér",
        openingHours: "08:00 - 18:00",
        services: ["ATM", "Bankfiók"],
    },
    {
        lat: 47.1625,
        lng: 19.5033,
        name: "Kecskemét, Főtér",
        openingHours: "09:00 - 17:00",
        services: ["Bankfiók"],
    },
    {
        lat: 46.2530,
        lng: 20.1486,
        name: "Szeged, Dóm tér",
        openingHours: "10:00 - 19:00",
        services: ["ATM", "Hitelügyintézés"],
    },
    {
        lat: 47.6875,
        lng: 17.6504,
        name: "Győr, Széchenyi tér",
        openingHours: "07:30 - 16:30",
        services: ["Bankfiók", "Biztosítás"],
    },
    {
        lat: 46.8964,
        lng: 19.6897,
        name: "Kiskunfélegyháza, Kossuth tér",
        openingHours: "08:30 - 17:30",
        services: ["ATM", "Pénzváltás"],
    },
    {
        lat: 47.1937,
        lng: 18.4080,
        name: "Székesfehérvár, Várkörút",
        openingHours: "09:00 - 16:00",
        services: ["Bankfiók", "Hitelügyintézés"],
    },
];

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query")?.trim().toLowerCase() || "";

        const filteredLocations = query
            ? fakeLocations.filter((loc) =>
                loc.name.toLowerCase().includes(query)
            )
            : fakeLocations;

        console.log("✅ API válasz:", JSON.stringify(filteredLocations, null, 2));
        return NextResponse.json(filteredLocations, { status: 200 });
    } catch (error) {
        console.error("❌ API HIBA:", error);
        return NextResponse.json(
            { error: "Hiba történt az API hívás során" },
            { status: 500 }
        );
    }
}