import axios from "axios";

type GeoCode = {
    startLocation: string,
    endLocation: string
}

export const getGeoCodes = async ({ startLocation, endLocation }: GeoCode) => {
    try {
        const start = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
                params: {
                    address: `${startLocation}, Sri Lanka`,
                    key: process.env.GCLOUD_API_KEY!,
                },
            }
        );

        const end = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
                params: {
                    address: `${endLocation}, Sri Lanka`,
                    key: process.env.GCLOUD_API_KEY!,
                },
            }
        );
        return {
            departure: start.data.results[0].geometry.location,
            destination: end.data.results[0].geometry.location,
        }
    } catch (error) {
        console.error("Error getting geocodes:", error);
        throw error;
    }
}