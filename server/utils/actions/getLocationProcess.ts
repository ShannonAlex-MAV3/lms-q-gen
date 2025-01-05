import { getGeoCodes } from "../query/getGeoCodes";
import { listPollyLines } from "../query/listPlooylines";

type GeoCode = {
    start: string;
    end: string;
};

export const getLocationProcess = async ({ start, end }: GeoCode): Promise<any> => {
    try {
        const response = await getGeoCodes({ startLocation: start, endLocation: end });
        if (!response) {
            return "An error occurred while processing your request.";
        }
        // get the direction & pollyline data
        const polyLineData = await listPollyLines({
            departure: response.departure,
            destination: response.destination
        });
        const points = decodePollyLines(polyLineData);
        if (points.length === 0) return "An error occurred while processing your request.";

        return {
            coordinates: [response.departure, response.destination],
            points: releasePoints(points),
        };
    } catch (error) {
        return "An error occurred while processing your request." + error;
    }
};