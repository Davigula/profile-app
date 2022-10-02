export interface FileInfo {
  _id: string,
  length?: number,
  chunkSize?: number,
  uploadDate?: Date,
  filename?: string,
  md5?: string,
  contentType?: string,
  metadata?: { 
    owner?: string,
    url?: string
  }
}