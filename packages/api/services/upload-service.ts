import { axiosRequestor } from "../../../lib/api/axios-client"

export interface IPresignedUrlResponse {
  signedUrl: string
  fileUrl: string
}

interface IProfilePhotoResponse {
  photoUrl: string
}

export const uploadService = {
  async getPresignedUrl(fileName: string, fileType: string): Promise<IPresignedUrlResponse> {
    const response = await axiosRequestor.get<IPresignedUrlResponse>("/get-signed-url", {
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

  async uploadProfilePhoto(file: File | Blob, fileName: string): Promise<string> {
    const formData = new FormData()
    formData.append("image", file, fileName)

    const response = await axiosRequestor.post<IProfilePhotoResponse>(
      "/profile/photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )

    if (!response.data.photoUrl) {
      throw new Error("Invalid profile photo upload response")
    }

    return response.data.photoUrl
  },

  async uploadImage(file: File | Blob, fileName: string): Promise<string | null> {
    return this.uploadProfilePhoto(file, fileName)
  },
}
