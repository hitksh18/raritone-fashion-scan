
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Play, Square } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getUserScans, saveScan, ScanData } from '@/lib/scan';

const Scan = () => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [scans, setScans] = useState<ScanData[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (user) {
      loadScans();
    }
  }, [user]);

  const loadScans = async () => {
    if (user) {
      try {
        const userScans = await getUserScans(user.uid);
        setScans(userScans);
      } catch (error) {
        console.error('Error loading scans:', error);
      }
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please allow camera access to use body scan.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startScan = async () => {
    if (!stream) {
      await startCamera();
      return;
    }

    setIsScanning(true);
    setCountdown(30);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          completeScan();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeScan = async () => {
    setIsScanning(false);
    
    if (user) {
      try {
        const scanData = {
          scanId: `scan_${Date.now()}`,
          height: null,
          weight: null,
          imageURL: null,
          device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          tryOnCount: 0
        };

        await saveScan(user.uid, scanData);
        await loadScans();
        
        alert('Body scan completed successfully!');
      } catch (error) {
        console.error('Error saving scan:', error);
        alert('Error saving scan. Please try again.');
      }
    }

    stopCamera();
  };

  const cancelScan = () => {
    setIsScanning(false);
    setCountdown(0);
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-8">Please login to access body scan feature</p>
          <Button onClick={() => window.location.href = '/'} className="bg-black text-white hover:bg-gray-800">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-light text-gray-900 mb-4">Body Scan Studio</h1>
          <p className="text-xl text-gray-600">Create your digital avatar with AI-powered scanning</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scan History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Scan History</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Scans:</span>
                <span className="font-medium">{scans.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Scan:</span>
                <span className="font-medium">
                  {scans.length > 0 
                    ? new Date(scans[0].scanTime).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Try-Ons Completed:</span>
                <span className="font-medium">
                  {scans.reduce((total, scan) => total + scan.tryOnCount, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Camera Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="aspect-video bg-gray-900 rounded-lg mb-6 relative overflow-hidden">
              {stream ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white text-6xl font-bold">
                        {countdown}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <Camera size={48} className="mx-auto mb-4" />
                    <p>Camera Preview</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Scan Instructions:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Stand 6 feet from camera</li>
                  <li>• Ensure good lighting</li>
                  <li>• Wear fitted clothing</li>
                  <li>• Stay still during the 30-second scan</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                {!isScanning ? (
                  <Button
                    onClick={startScan}
                    className="flex-1 bg-black text-white hover:bg-gray-800 flex items-center justify-center space-x-2"
                  >
                    <Play size={20} />
                    <span>Start Body Scan</span>
                  </Button>
                ) : (
                  <Button
                    onClick={cancelScan}
                    variant="destructive"
                    className="flex-1 flex items-center justify-center space-x-2"
                  >
                    <Square size={20} />
                    <span>Cancel Scan</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
