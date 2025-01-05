import axios from "axios"

type ListCoordinates = {
    departure: {
        lat: number,
        lng: number
    },
    destination: {
        lat: number,
        lng: number
    }
}
export const listPollyLines = async ({ departure, destination }: ListCoordinates) => {
    const params = {
        origin: `${departure.lat},${departure.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: process.env.GCLOUD_API_KEY!,
    };

    const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
        params
    });

    if (!response) {
        console.log("No response" + response);
    }
    const route = response.data.routes[0];
    return route.overview_polyline.points;
}