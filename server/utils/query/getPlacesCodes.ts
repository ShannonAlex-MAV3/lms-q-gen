import axios from "axios";

type GeoCode = {
    lat: string
    lng: string
}

const getLocationRestaurants = async ({ lat, lng }: GeoCode) => {
    try {
        const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
            params: {
                location: `${lat},${lng}`,
                radius: 5000,
                type: 'restaurant',
                key: process.env.GCLOUD_API_KEY!,
            },

        });

        console.log(response.data.results);
    } catch (error) {
        console.error("Error fetching geocode:", error);
        throw new Error("Failed to get answers" + error);
    }
}

export default getLocationRestaurants