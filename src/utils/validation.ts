export function validateFile(file: File): string | null {
    const allowedFormats = ["application/pdf", "video/mp4", "video/quicktime", "video/x-msvideo"];
  
    if (!allowedFormats.includes(file.type)) {
      return "Only PDF and video files (MP4, MOV, AVI) are allowed.";
    }
    return null;
  }
  