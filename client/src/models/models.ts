export interface UploadResult {
  event: string;
  info: {
    asset_folder: string;
    asset_id: string;
    batchId: string;
    bytes: number;
    created_at: string;
    display_name: string;
    etag: string;
    format: string;
    height: number;
    id: string;
    original_filename: string;
    path: string;
    placeholder: boolean;
    public_id: string;
    resource_type: string;
    secure_url: string;
    signature: string;
    tags: string[];
    thumbnail_url: string;
    type: string;
    url: string;
    version: number;
    version_id: string;
    width: number;
  };
}

export interface UploadWidgetConfig {
  cloudName: string;
  uploadPreset: string;
  cropping?: boolean;
  showAdvancedOptions?: boolean;
  sources?: string[];
  multiple: boolean;
  folder?: string;
  tags?: string[];
  context?: { alt: string };
  clientAllowedFormats?: string[];
  maxImageFileSize?: number;
  maxImageWidth?: number;
  theme?: string;
}

export interface Metadata {
  id: string;
  createdAt: string;
}
