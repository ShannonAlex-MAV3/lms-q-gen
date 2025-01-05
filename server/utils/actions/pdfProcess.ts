import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { Document } from "langchain/document";

export const pdfTextSplitter = async (blob: Blob): Promise<Document<Record<string, unknown>>[]> => {
    try {
        const pdfLoader = new WebPDFLoader(blob);
        const docs = await pdfLoader.load();

        // chucnk the documents
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const chunkedDocs = await splitter.splitDocuments(docs);
        return chunkedDocs

    } catch (error) {
        throw new Error("Error splitting PDF: " + error);
    }
}

// upload pdf to s3 bucket

// save pdf to database