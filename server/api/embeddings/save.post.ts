import { saveEmbeddings } from "~/utils/actions/saveVectors";

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
        await saveEmbeddings(body.chunks, "pdf");

        return {
            message: "Embeddings created successfully",
            statusCode: 200,
            success: true
        } as HTTPResponse
    } catch (error) {
        return error
    }
})