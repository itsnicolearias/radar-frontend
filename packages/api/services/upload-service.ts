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
    return response.data
  },

  async uploadToS3(presignedUrl: string, file: File | Blob): Promise<void> {
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })
  },

  async uploadImage(file: File | Blob, fileName: string): Promise<string | null> {

    const { signedUrl, fileUrl } = await this.getPresignedUrl(fileName, file.type)

    if (signedUrl) {
      await this.uploadToS3(signedUrl, file)
      return fileUrl
    }
    return null;
  },
}
