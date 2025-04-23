"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Maximize,
} from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  onBack: () => void;
}

export default function PDFViewer({ pdfUrl, title, onBack }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        // The PDF will be loaded in the iframe
        setLoading(false);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF. Please try again later.");
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (iframeRef.current) {
        // Send message to iframe to change page
        iframeRef.current.contentWindow?.postMessage(
          { type: "setPage", page: newPage },
          "*"
        );
      }
    }
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
    setZoom(newZoom);
    if (iframeRef.current) {
      iframeRef.current.style.transform = `scale(${newZoom})`;
      iframeRef.current.style.transformOrigin = 'top center';
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          handlePageChange(currentPage - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          handlePageChange(currentPage + 1);
          break;
        case "+":
          e.preventDefault();
          handleZoom(0.1);
          break;
        case "-":
          e.preventDefault();
          handleZoom(-0.1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Course
      </Button>

      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
          <CardTitle className="text-xl md:text-2xl font-bold">
            {loading ? "Loading PDF..." : title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-[600px] bg-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[600px] bg-gray-100">
              <div className="text-red-500 text-center p-6">
                <p className="text-xl font-semibold mb-2">Error</p>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <div 
              className={`relative ${isFullscreen ? 'h-screen w-screen' : ''}`} 
              ref={containerRef}
            >
              <div className={`${isFullscreen ? 'h-screen' : 'h-[600px]'} overflow-auto bg-gray-100`}>
                <iframe
                  ref={iframeRef}
                  src={`${pdfUrl}#toolbar=0`}
                  className={`w-full h-full transform origin-top-center transition-transform duration-200 ${
                    isFullscreen ? 'max-h-screen' : ''
                  }`}
                  style={{
                    transform: `scale(${zoom})`,
                  }}
                  onLoad={() => setLoading(false)}
                />
              </div>

              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 ${
                isFullscreen ? 'pb-8' : ''
              }`}>
                <div className="flex items-center justify-between text-white mb-2">
                  <span>Page {currentPage} of {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleZoom(-0.1)}
                    >
                      <ZoomOut className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleZoom(0.1)}
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={downloadPDF}
                    >
                      <Download className="w-5 h-5" />
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

      {!isFullscreen && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">PDF Viewer Controls</h2>
          <p className="text-gray-700">
            Use the controls below the PDF to navigate pages, adjust zoom level, download the PDF, or enter fullscreen mode.
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <h3 className="font-semibold text-blue-700">Keyboard Shortcuts:</h3>
            <ul className="list-disc pl-5 text-sm text-blue-600 mt-1">
              <li>← (Left Arrow): Previous page</li>
              <li>→ (Right Arrow): Next page</li>
              <li>+ : Zoom in</li>
              <li>- : Zoom out</li>
              <li>F: Toggle fullscreen</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 