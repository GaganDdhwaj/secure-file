import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Fingerprint, Camera, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import * as faceDetection from '@tensorflow-models/face-detection';
import '@tensorflow/tfjs';

export const BiometricSetup = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [captureMode, setCaptureMode] = useState<'none' | 'face' | 'fingerprint'>('none');
  const [loading, setLoading] = useState(false);
  const { tempRegistrationData, registerUser } = useAuthStore();

  const captureImage = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setLoading(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');

      // Load face detection model
      const model = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector
      );

      // Create an image element to process
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => (img.onload = resolve));

      // Detect faces
      const faces = await model.estimateFaces(img);
      
      if (faces.length === 0) {
        throw new Error('No face detected');
      }

      if (faces.length > 1) {
        throw new Error('Multiple faces detected');
      }

      // Register user with face data
      await registerUser({
        ...tempRegistrationData,
        faceData: imageSrc,
      });

      navigate('/user-login');
    } catch (error) {
      console.error('Face capture failed:', error);
      alert('Face capture failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [webcamRef, tempRegistrationData, registerUser, navigate]);

  const setupFingerprint = async () => {
    setLoading(true);
    try {
      // Check if device supports fingerprint
      if (!window.PublicKeyCredential) {
        throw new Error('Fingerprint authentication not supported on this device');
      }

      // In a real app, you would integrate with the WebAuthn API here
      // For demo purposes, we'll simulate fingerprint registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await registerUser({
        ...tempRegistrationData,
        fingerprintData: 'simulated-fingerprint-data',
      });

      navigate('/user-login');
    } catch (error) {
      console.error('Fingerprint setup failed:', error);
      alert('Fingerprint setup failed. Please try face recognition instead.');
    } finally {
      setLoading(false);
    }
  };

  if (!tempRegistrationData) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <button
            onClick={() => {
              if (captureMode === 'none') navigate('/signup');
              else setCaptureMode('none');
            }}
            className="text-white mb-6 flex items-center hover:text-blue-400"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          {captureMode === 'none' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Biometric Setup</h2>
                <p className="text-gray-300">Choose your preferred verification method</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setCaptureMode('face')}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-between text-white"
                >
                  <div className="flex items-center">
                    <Camera className="h-6 w-6 mr-3 text-blue-500" />
                    <span>Face Recognition</span>
                  </div>
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </button>

                <button
                  onClick={() => setCaptureMode('fingerprint')}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-between text-white"
                >
                  <div className="flex items-center">
                    <Fingerprint className="h-6 w-6 mr-3 text-green-500" />
                    <span>Fingerprint</span>
                  </div>
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </button>
              </div>
            </>
          ) : captureMode === 'face' ? (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Face Recognition Setup</h3>
                <p className="text-gray-300">Position your face in the frame</p>
              </div>

              <div className="relative rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg"
                />
              </div>

              <button
                onClick={captureImage}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Capture & Register'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Fingerprint Setup</h3>
                <p className="text-gray-300">Follow your device's fingerprint setup prompt</p>
              </div>

              <div className="flex justify-center">
                <Fingerprint className="h-24 w-24 text-green-500 animate-pulse" />
              </div>

              <button
                onClick={setupFingerprint}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Start Fingerprint Setup'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};