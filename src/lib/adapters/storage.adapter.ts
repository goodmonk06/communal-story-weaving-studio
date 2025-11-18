/**
 * Storage Adapter Interface
 * Abstract file storage for future media uploads (local, S3, etc.)
 */

export interface StorageUploadOptions {
  filename: string
  contentType?: string
  metadata?: Record<string, string>
}

export interface StorageObject {
  key: string
  url: string
  size: number
  contentType?: string
  metadata?: Record<string, string>
}

export interface IStorageAdapter {
  /**
   * Upload a file
   */
  upload(data: Buffer | string, options: StorageUploadOptions): Promise<StorageObject>

  /**
   * Download a file
   */
  download(key: string): Promise<Buffer>

  /**
   * Delete a file
   */
  delete(key: string): Promise<void>

  /**
   * Get a public URL for a file
   */
  getPublicUrl(key: string): string

  /**
   * Get a signed URL for temporary access
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>
}

/**
 * Local filesystem storage adapter
 */
export class LocalStorageAdapter implements IStorageAdapter {
  private basePath: string
  private baseUrl: string

  constructor(basePath = './uploads', baseUrl = '/uploads') {
    this.basePath = basePath
    this.baseUrl = baseUrl
  }

  async upload(data: Buffer | string, options: StorageUploadOptions): Promise<StorageObject> {
    const fs = await import('fs/promises')
    const path = await import('path')

    const key = `${Date.now()}-${options.filename}`
    const filePath = path.join(this.basePath, key)

    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true })

    // Write file
    await fs.writeFile(filePath, data)

    // Get file stats
    const stats = await fs.stat(filePath)

    return {
      key,
      url: `${this.baseUrl}/${key}`,
      size: stats.size,
      contentType: options.contentType,
      metadata: options.metadata,
    }
  }

  async download(key: string): Promise<Buffer> {
    const fs = await import('fs/promises')
    const path = await import('path')

    const filePath = path.join(this.basePath, key)
    return fs.readFile(filePath)
  }

  async delete(key: string): Promise<void> {
    const fs = await import('fs/promises')
    const path = await import('path')

    const filePath = path.join(this.basePath, key)
    await fs.unlink(filePath)
  }

  getPublicUrl(key: string): string {
    return `${this.baseUrl}/${key}`
  }

  async getSignedUrl(key: string, _expiresIn?: number): Promise<string> {
    // For local storage, just return the public URL
    return this.getPublicUrl(key)
  }
}

/**
 * No-op storage adapter for testing
 */
export class NoOpStorageAdapter implements IStorageAdapter {
  async upload(_data: Buffer | string, options: StorageUploadOptions): Promise<StorageObject> {
    return {
      key: `noop-${options.filename}`,
      url: `/noop/${options.filename}`,
      size: 0,
    }
  }

  async download(_key: string): Promise<Buffer> {
    return Buffer.from('')
  }

  async delete(_key: string): Promise<void> {
    // Do nothing
  }

  getPublicUrl(key: string): string {
    return `/noop/${key}`
  }

  async getSignedUrl(key: string): Promise<string> {
    return this.getPublicUrl(key)
  }
}

// Global adapter
let currentAdapter: IStorageAdapter = new LocalStorageAdapter()

export function setStorageAdapter(adapter: IStorageAdapter) {
  currentAdapter = adapter
}

export function getStorageAdapter(): IStorageAdapter {
  return currentAdapter
}
