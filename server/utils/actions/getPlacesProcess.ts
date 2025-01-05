import getLocationRestaurants from "../query/getPlacesCodes";

type GeoCode = {
    lat: string;
    lng: string;
};

export const getPlacesProcess = async ({ lat, lng }: GeoCode): Promise<any> => {
    try {
        const response = await getLocationRestaurants({ lat, lng });
        return response;
    } catch (error) {
        console.error("Chat process error:", error);
        return "An error occurred while processing your request.";
    }
}