import {embed} from "ai"
import {google} from "@ai-sdk/google"

export async function generateEmbeddings(text: string){
    const {embedding} = await embed({
        model: google.textEmbeddingModel("text-embedding-004"),
        value: text
    })
    return embedding
}

export async function indexCodebase(repoId: string, files: {path: string, content: string}[]){

}