import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, FileImage, CheckCircle } from "lucide-react";

interface ObjectUploaderProps {
  maxFileSize?: number;
  onComplete?: (uploadUrl: string) => void;
  onGetUploadParameters?: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  buttonClassName?: string;
  children: ReactNode;
  accept?: string;
  description?: string;
}

/**
 * A file upload component that renders as a button and provides a modal interface for
 * file management.
 * 
 * Features:
 * - Renders as a customizable button that opens a file upload modal
 * - File preview and upload progress tracking
 * - Drag and drop support
 * - File validation (size, type)
 * 
 * @param props - Component props
 * @param props.maxFileSize - Maximum file size in bytes (default: 10MB)
 * @param props.onComplete - Callback function called when upload is complete with the upload URL
 * @param props.buttonClassName - Optional CSS class name for the button
 * @param props.children - Content to be rendered inside the button
 * @param props.accept - File types to accept (default: images)
 * @param props.description - Description text to show in the upload area
 */
export function ObjectUploader({
  maxFileSize = 10485760, // 10MB default
  onComplete,
  onGetUploadParameters,
  buttonClassName,
  children,
  accept = "image/*",
  description = "Upload an image file (max 10MB)",
}: ObjectUploaderProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const validateFile = (file: File): boolean => {
    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`,
        variant: "destructive",
      });
      return false;
    }

    if (accept === "image/*" && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadComplete(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Get upload URL from backend
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await response.json();

      // Upload file directly to object storage
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      setUploadProgress(100);
      setUploadComplete(true);
      
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully",
      });

      // Call the onComplete callback with the upload URL
      onComplete?.(uploadURL);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setUploading(false);
  };

  const closeModal = () => {
    setOpen(false);
    if (uploadComplete) {
      resetUpload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName} data-testid="button-open-uploader">
          {children}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Select a file to upload to the platform. Supported formats and size limits apply.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              data-testid="upload-drop-zone"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your file here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">{description}</p>
              
              <Label htmlFor="file-input">
                <Button variant="outline" className="cursor-pointer" data-testid="button-browse-file">
                  Browse Files
                </Button>
              </Label>
              <Input
                id="file-input"
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-file-hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Preview */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <FileImage className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900" data-testid="text-file-name">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500" data-testid="text-file-size">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {!uploading && !uploadComplete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetUpload}
                      data-testid="button-remove-file"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {/* Image Preview */}
                {selectedFile.type.startsWith('image/') && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded"
                      data-testid="img-file-preview"
                    />
                  </div>
                )}
                
                {/* Upload Progress */}
                {uploading && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Uploading...</span>
                      <span className="text-sm text-gray-600">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" data-testid="progress-upload" />
                  </div>
                )}
                
                {/* Upload Complete */}
                {uploadComplete && (
                  <div className="mt-3 flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Upload complete!</span>
                  </div>
                )}
              </div>
              
              {/* Upload Actions */}
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={closeModal}
                  data-testid="button-cancel-upload"
                >
                  {uploadComplete ? 'Close' : 'Cancel'}
                </Button>
                {!uploadComplete && (
                  <Button 
                    onClick={uploadFile}
                    disabled={uploading}
                    data-testid="button-start-upload"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}