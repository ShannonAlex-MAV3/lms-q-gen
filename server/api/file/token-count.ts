import { readMultipartFormData } from 'h3';
import { pdfTextSplitter } from '../../utils/actions/pdfProcess';
import { getEmbeddings } from '../../utils/actions/textEmbed';

export default defineEventHandler(async (event) => {
    try {
        const formData: any = await readMultipartFormData(event);
        const file = formData[0];

        if (file.filename === "") {
            return {
                message: "No file uploaded",
                statusCode: 400,
                body: null,
                success: false
            } as HTTPResponse;
        }

        // Create a Blob from the buffer
        const blob = new Blob([file.data], { type: 'application/pdf' });
        // Split the document into chunks
        const response = await pdfTextSplitter(blob);

        // Calculate the total token count
        let totalTokenCount = 0;
        for (const chunk of response) {
            const embeddings = await getEmbeddings(chunk.pageContent);
            totalTokenCount += embeddings.length;
        }

        
        return {
            message: "Token count",
            statusCode: 200,
            success: false,
            body: {
                totalTokenCount: totalTokenCount
            }
        } as HTTPResponse;

    } catch (error) {
        return {
            message: "Error :" + error,
            statusCode: 500,
            body: null,
            success: false
        };
    }
});