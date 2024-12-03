import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Fingerprint, Camera, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import * as faceDetection from '@tensorflow-models/face-detection';
import '@tensorflow/tfjs';

export const BiometricVerification = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [verifyMode, setVerifyMode] = useState<'none' | 'face' | 'fingerprint'>('none');
  const [loading, setLoading] = useState(false);
  const { verifyBiometric, user } = useAuthStore();

  const verifyFace = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setLoading(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');

      const model = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector
      );

      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => (img.onload = resolve));

      const faces = await model.estimateFaces(img);
      
      if (faces.length === 0) {
        throw new Error('No face detected');
      }

      if (faces.length > 1) {
        throw new Error('Multiple faces detected');
      }

      const verified = await verifyBiometric('face', imageSrc);
      if (verified) {
        navigate('/user-dashboard');
      } else {
        throw new Error('Face verification failed');
      }
    } catch (error) {
      console.error('Face verification failed:', error);
      alert('Face verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [webcamRef, verifyBiometric, navigate]);

  const verifyFingerprint = async () => {
    setLoading(true);
    try {
      if (!window.PublicKeyCredential) {
        throw new Error('Fingerprint authentication not supported on this device');
      }

      // Simulate fingerprint verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const verified = await verifyBiometric('fingerprint', 'simulated-fingerprint-data');
      if (verified) {
        navigate('/user-dashboard');
      } else {
        throw new Error('Fingerprint verification failed');
      }
    } catch (error) {
      console.error('Fingerprint verification failed:', error);
      alert('Fingerprint verification failed. Please try face recognition instead.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/user-login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <button
            onClick={() => {
              if (verifyMode === 'none') navigate('/user-login');
              else setVerifyMode('none');
            }}
            className="text-white mb-6 flex items-center hover:text-blue-400"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          {verifyMode === 'none' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Verify Identity</h2>
                <p className="text-gray-300">Choose your verification method</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setVerifyMode('face')}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-between text-white"
                >
                  <div className="flex items-center">
                    <Camera className="h-6 w-6 mr-3 text-blue-500" />
                    <span>Face Recognition</span>
                  </div>
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </button>

                <button
                  onClick={() => setVerifyMode('fingerprint')}
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
          ) : verifyMode === 'face' ? (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Face Verification</h3>
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
                onClick={verifyFace}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Face'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Fingerprint Verification</h3>
                <p className="text-gray-300">Use your registered fingerprint to verify</p>
              </div>

              <div className="flex justify-center">
                <Fingerprint className="h-24 w-24 text-green-500 animate-pulse" />
              </div>

              <button
                onClick={verifyFingerprint}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Fingerprint'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};