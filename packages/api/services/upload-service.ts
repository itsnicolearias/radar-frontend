import { axiosClient } from "../axios-client"

export interface IPresignedUrlResponse {
  signedUrl: string
  fileUrl: string
}

export const uploadService = {
  async getPresignedUrl(fileName: string, fileType: string): Promise<IPresignedUrlResponse> {
    const response = await axiosClient.get<IPresignedUrlResponse>("/get-signed-url", {
      params: { fileName, fileType },
    })

     if (!response.data.signedUrl || !response.data.fileUrl) {
      throw new Error("Invalid presigned URL response")
    }
    return response.data
  },

  async uploadToS3(presignedUrl: string, file: File | Blob): Promise<void> {
    try {
      const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })
    
    if (!response.ok) {
      throw new Error("Failed to upload file to S3")
    }
    } catch (error) {
      throw new Error("Error uploading file to S3")
    }

  },

  async uploadImage(file: File | Blob, fileName: string): Promise<string | null> {

    const { signedUrl, fileUrl } = await this.getPresignedUrl(fileName, file.type)

    await this.uploadToS3(signedUrl, file)
    return fileUrl

  },
}
