"use client";

import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { Location } from "@/types";

interface MapProps {
    locations: Location[];
    selectedLocation: Location | null;
    onLocationSelect: (location: Location) => void;
}

const containerStyle = {
    width: "100%",
    height: "100vh",
};

const defaultCenter = {
    lat: 47.1625,
    lng: 19.5033,
};

const MapComponent: React.FC<MapProps> = ({ locations, selectedLocation, onLocationSelect }) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);

    useEffect(() => {
        if (selectedLocation && map) {
            map.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng });
            map.setZoom(14);
            setSelectedMarker(selectedLocation);
        }
    }, [selectedLocation, map]);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={7}
                onLoad={(map) => setMap(map)}
            >
                {locations.map((loc, index) => (
                    <Marker
                        key={index}
                        position={{ lat: loc.lat, lng: loc.lng }}
                        onClick={() => setSelectedMarker(loc)}
                        label={{
                            text: (index + 1).toString(),
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "14px",
                        }}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 24,
                            fillColor: "#007bff",
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: "white",
                        }}
                    />
                ))}

                {selectedMarker && (
                    <InfoWindow
                        position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="p-2 bg-white shadow-md rounded-md">
                            <h3 className="text-lg font-semibold text-black">{selectedMarker.name}</h3>
                            <p className="text-sm text-blue-500">🕒 Nyitvatartás: {selectedMarker.openingHours}</p>
                            <p className="text-sm text-blue-700" >🛠️ Szolgáltatások: {selectedMarker.services.join(", ")}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;