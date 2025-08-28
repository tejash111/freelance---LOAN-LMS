"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

const UserVerification = () => {
  const [status, setStatus] = useState('pending'); // pending, verifying, approved, verified
  const [timer, setTimer] = useState(3);
  const [userActive, setUserActive] = useState(); // Simulating Firebase user.status
  const router = useRouter()
  console.log(auth.currentUser?.uid || "No user logged in yet");
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ User logged in:", firebaseUser.uid);
        setUser(firebaseUser);
        checkUserStatus(firebaseUser.uid);
      } else {
        console.log("❌ No user logged in");
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Check Firestore user status
  const checkUserStatus = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists() && userDoc.data()?.status === 'verified') {
      router.push('/admin/dashboard');
    }
  };

  const startVerification = () => {
    setStatus('verifying');
    setTimer(3);
    
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setStatus('verified');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetStatus = () => {
    setStatus('pending');
    setTimer(3);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-20 h-20 text-yellow-500 animate-pulse" />;
      case 'verifying':
        return <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>;
      case 'verified':
        return <Clock className="w-20 h-20 text-blue-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Application Pending';
      case 'verifying':
        return `Verifying... ${timer}`;
      case 'verified':
        return 'Awaiting Manual Approval';
      default:
        return '';
    }
  };

  const getStatusSubtext = () => {
    switch (status) {
      case 'pending':
        return 'Click the button below to start verification process';
      case 'verifying':
        return 'Please wait while we verify your information';
      case 'verified':
        return 'Automatic verification complete. Waiting for manual approval from admin.';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-300';
      case 'verifying':
        return 'bg-blue-50 border-blue-300';
      case 'verified':
        return 'bg-blue-50 border-blue-300';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Progress Steps */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              ['pending', 'verifying', 'verified'].includes(status)
                ? 'bg-yellow-500'
                : 'bg-gray-300'
            }`}></div>
            <span className={`text-sm font-medium ${
              ['pending', 'verifying', 'verified'].includes(status)
                ? 'text-yellow-700'
                : 'text-gray-500'
            }`}>Pending</span>
          </div>
          
          <div className="w-8 h-px bg-gray-300"></div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              ['verifying', 'verified'].includes(status)
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}></div>
            <span className={`text-sm font-medium ${
              ['verifying', 'verified'].includes(status)
                ? 'text-blue-700'
                : 'text-gray-500'
            }`}>Verified</span>
          </div>
          
          <div className="w-8 h-px bg-gray-300"></div>
          
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-500">Approved</span>
          </div>
        </div>

        {/* Status Card */}
        <div className={`bg-white rounded-2xl shadow-lg border-2 ${getStatusColor()} p-8`}>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getStatusText()}
              </h2>
              <p className="text-gray-600">
                {getStatusSubtext()}
              </p>
            </div>

            {status === 'pending' && (
              <button
                onClick={startVerification}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                Start Verification
              </button>
            )}

            {status === 'verified' && (
              <div className="space-y-4">
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Next Steps:</strong> Your application has been automatically verified. 
                    An admin will review and manually approve your application soon. 
                    You will be notified once approved.
                  </p>
                </div>
                
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Application ID: #APP-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserVerification;