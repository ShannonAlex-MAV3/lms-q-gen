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

        // prase to embeddings
        const response = await getEmbeddings(body.message);
        return {
            message: "Embeddings created successfully",
            statusCode: 200,
            body: response,
            success: true
        } as HTTPResponse
    } catch (error) {
        return error
    }
})