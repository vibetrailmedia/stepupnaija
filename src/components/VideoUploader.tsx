import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, AlertCircle, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  onUploadComplete?: (videoUrl: string) => void;
  onClose?: () => void;
  maxSizeMB?: number;
}

export function VideoUploader({ 
  onUploadComplete, 
  onClose, 
  maxSizeMB = 100 
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();

  const validateVideoFile = (file: File): string | null => {
    // Check file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
    if (!validTypes.includes(file.type)) {
      return "Please select a valid video file (MP4, WebM, OGG, AVI, MOV)";
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateVideoFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError("");
    setSuccess("");
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      // Step 1: Get upload URL from server
      const uploadResponse = await fetch('/api/public/videos/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await uploadResponse.json();
      setUploadProgress(25);

      // Step 2: Upload file directly to object storage
      const formData = new FormData();
      formData.append('file', selectedFile);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = 25 + Math.round((event.loaded / event.total) * 65);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          setUploadProgress(95);
          
          // Step 3: Notify server about successful upload
          try {
            const finalizeResponse = await fetch('/api/public/videos/finalize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                videoURL: uploadURL,
                filename: selectedFile.name,
                fileSize: selectedFile.size,
                contentType: selectedFile.type
              }),
            });

            if (finalizeResponse.ok) {
              const { videoPath } = await finalizeResponse.json();
              setUploadProgress(100);
              setSuccess("Video uploaded successfully!");
              
              onUploadComplete?.(videoPath);
              
              // Auto-close immediately after success
              setTimeout(() => {
                onClose?.();
                
                // Show success toast after component closes
                toast({
                  title: "Success! 🎬",
                  description: "Your Tari video has been uploaded and is ready to watch!",
                });
              }, 500);
            } else {
              throw new Error('Failed to finalize upload');
            }
          } catch (error) {
            throw new Error('Upload completed but failed to process');
          }
        } else {
          throw new Error(`Upload failed: ${xhr.statusText}`);
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Network error during upload');
      });

      xhr.open('PUT', uploadURL);
      xhr.setRequestHeader('Content-Type', selectedFile.type);
      xhr.send(selectedFile);

    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
      toast({
        title: "Upload Failed",
        description: error.message || 'Something went wrong. Please try again.',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Video className="w-5 h-5 mr-2" />
            Upload Tari Video
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* File Selection */}
        <div>
          <label htmlFor="video-upload" className="block text-sm font-medium mb-2">
            Select Video File (Max {maxSizeMB}MB)
          </label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 cursor-pointer"
            data-testid="video-file-input"
          />
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-blue-600">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>
          
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}