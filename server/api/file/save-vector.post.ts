import { readMultipartFormData } from 'h3';
import { saveEmbeddings } from "~/utils/actions/saveVectors";
import { pdfTextSplitter } from '../../utils/actions/pdfProcess';

export default defineEventHandler(async (event) => {
    try {
        const formData: any = await readMultipartFormData(event);
        const file = formData[0]

        if (file.filename === "") {
            return {
                message: "No file uploaded",
                statusCode: 400,
                body: null,
                success: false
            } as HTTPResponse
        }

        // Create a Blob from the buffer
        const blob = new Blob([file.data], { type: 'application/pdf' });
        // split the document into chunks
        const response = await pdfTextSplitter(blob);

        // prase to embeddings
        await saveEmbeddings(response, "pdf");

        return {
            message: "Created Chunks and Saved successfully",
            statusCode: 200,
            success: true
        } as HTTPResponse

    } catch (error) {
        return {
            message: "Error uploading file" + error,
            statusCode: 500,
            body: null,
            success: false
        }
    }
})