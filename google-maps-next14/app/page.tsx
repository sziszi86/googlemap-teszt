"use client";

import { useState, useEffect } from "react";
import MapComponent from "@/components/Map";
import { Location } from "@/types";

export default function Home() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchLocations(searchTerm);
        }, 500); // 0.5 másodperces késleltetés a keresésben

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const fetchLocations = async (query: string = "") => {
        try {
            const response = await fetch(`/api/places?query=${query}`);

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Hiba történt az adatok betöltésekor");
                return;
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Hibás API válasz: nem tömb");
            }

            setLocations(data);
            setError(null);
        } catch (err) {
            console.error("Frontend hiba:", err);
            setError("Nem sikerült az adatok betöltése");
        }
    };

    return (
        <div className="relative w-full h-screen">
            <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg w-80">
                <h1 className="text-xl font-bold mb-2 text-black">Helyszínek</h1>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Város keresése..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-black"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="max-h-80 overflow-y-auto">
                    {locations.map((place, index) => (
                        <div
                            key={index}
                            className="p-2 border-b cursor-pointer hover:bg-gray-100 text-black"
                            onClick={() => setSelectedLocation(place)}
                        >
                            <strong>{index + 1}. {place.name}</strong>
                            <p className="text-sm text-gray-600">🕒 {place.openingHours}</p>
                            <p className="text-sm text-gray-600">🛠️ {place.services.join(", ")}</p>
                        </div>
                    ))}
                </div>
            </div>

            <MapComponent
                locations={locations}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
            />
        </div>
    );
}