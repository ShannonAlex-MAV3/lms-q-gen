export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        if (!body || body === undefined) {
            return {
                message: "Error: No query found",
                statusCode: 400,
                body: null,
                success: false
            } as HTTPResponse
        }
        const { start, end } = body;
        // const response = await getPlacesProcess({ lat: start, lng: end });
        return {
            message: "Fetched successfully",
            body: { start, end },
            statusCode: 200,
            success: true
        } as HTTPResponse
    } catch (error) {
        return error
    }
});
