"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";

export default function TutorVideoPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileId = params.fileId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        // Fetch the course details to get the video name
        const courseRes = await fetch(
          `http://localhost:5003/api/courses/${id}`,
          {
            credentials: "include",
          }
        );

        if (!courseRes.ok) {
          throw new Error("Failed to load course details");
        }

        const courseData = await courseRes.json();
        
        console.log("Looking for video with fileId:", fileId);
        
        // Find the file with the matching fileId
        let foundFile = null;

        // Search through all sections
        for (const section of courseData.sections || []) {
          for (const file of section.files || []) {
            // For debugging
            console.log(`Comparing file ID: ${file.id} with requested fileId: ${fileId}`);
            
            // More reliable strict equality check
            if (file.id.toString() === fileId.toString()) {
              console.log("Found matching file:", file.name);
              foundFile = file;
              break;
            }
          }
          if (foundFile) break;
        }

        if (!foundFile) {
          throw new Error(`Video file not found with ID: ${fileId}`);
        }

        setVideoTitle(foundFile.name);
        setVideoUrl(foundFile.url);
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError(`Failed to load video (ID: ${fileId}). Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id, fileId]);

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        videoRef.current.duration
      );
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 10,
        0
      );
    }
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      // Don't trigger shortcuts if user is typing in an input field
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key) {
        case " ": // Spacebar
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, isMuted]); // Re-create event handler when these states change

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Button 
        variant="outline" 
        onClick={() => router.push(`/mycourses/${id}`)}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Course
      </Button>

      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
          <CardTitle className="text-xl md:text-2xl font-bold">
            {loading ? "Loading video..." : videoTitle}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-[400px] bg-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[400px] bg-gray-100">
              <div className="text-red-500 text-center p-6">
                <p className="text-xl font-semibold mb-2">Error</p>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <div className="relative" ref={videoContainerRef}>
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-grow mx-4 h-1 rounded-full bg-white/30 appearance-none"
                    style={{
                      backgroundSize: `${(currentTime / duration) * 100}% 100%`,
                      backgroundRepeat: "no-repeat",
                      backgroundImage: "linear-gradient(to right, white, white)"
                    }}
                  />
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20"
                      onClick={skipBackward}
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20"
                      onClick={skipForward}
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Video Preview</h2>
        <p className="text-gray-700">
          This video player lets you preview your course video content exactly as students will see it. Use the player controls to test all functionality before publishing.
        </p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <h3 className="font-semibold text-blue-700">Keyboard Shortcuts:</h3>
          <ul className="list-disc pl-5 text-sm text-blue-600 mt-1">
            <li>Spacebar: Play/pause the video</li>
            <li>→ (Right Arrow): Skip forward 10 seconds</li>
            <li>← (Left Arrow): Skip backward 10 seconds</li>
            <li>M: Mute/unmute the video</li>
            <li>F: Toggle fullscreen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}