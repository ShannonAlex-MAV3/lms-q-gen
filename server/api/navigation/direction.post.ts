import { getLocationProcess } from "~/utils/actions/getLocationProcess"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        if (!body || body === undefined) {
            return {
                message: "Error: No body found",
                statusCode: 400,
                body: null,
                success: false
            } as HTTPResponse
        }
        const { start, end } = body;
        const response = await getLocationProcess({ start: start.toLocaleString(), end: end.toLocaleString() });
        
        return {
            message: "Fetched successfully",
            body: response,
            statusCode: 200,
            success: true
        } as HTTPResponse
    } catch (error) {
        return error
    }
})