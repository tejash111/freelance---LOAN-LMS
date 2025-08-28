"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../../firebase/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Upload, CheckCircle, AlertCircle, Clock, FileText, User, CreditCard, DollarSign, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAuth,onAuthStateChanged } from 'firebase/auth';

const EKYCWorkflow = ({ loanId }) => {
  const user = getAuth()
  console.log(user.currentUser);
  
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState('');
  const [verifyingDoc, setVerifyingDoc] = useState('');
 
  
  
  const [loanData, setLoanData] = useState({
    type: 'personal Loan',
    amount: '',
    tenure: '',
    income: '',
    cibil: '',
    purpose: '',
    employmentType: 'salaried'
  });

  const [documents, setDocuments] = useState({
    aadhaar: { url: '', status: 'pending', verified: false },
    pan: { url: '', status: 'pending', verified: false },
    bankStatement: { url: '', status: 'pending', verified: false },
    itr: { url: '', status: 'pending', verified: false }
  });

  const router = useRouter();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: user?.email || '',
    occupation: '',
    companyName: '',
    workExperience: ''
  });

  const steps = [
    { id: 1, title: 'Loan Details', icon: DollarSign, description: 'Enter loan requirements' },
    { id: 2, title: 'Personal Information', icon: User, description: 'Basic details and contact info' },
    { id: 3, title: 'Document Upload', icon: FileText, description: 'Upload required documents' },
    { id: 4, title: 'Verification', icon: CheckCircle, description: 'Document verification' },
    { id: 5, title: 'Review & Submit', icon: CreditCard, description: 'Final review and submission' }
  ];

  const loanTypes = [
    { value: 'personal Loan', label: 'Personal Loan' },
    { value: 'Home Loan', label: 'Home Loan' },
    { value: 'Vehicle Loan', label: 'Car Loan' },
    { value: 'business Loan', label: 'Business Loan' },
    { value: 'SHG Loan', label: 'SHG Loan' },
  ];

  const tenureOptions = [12, 18, 24, 36, 48, 60];

  // Load existing loan data if editing
  useEffect(() => {
    if (loanId) {
      loadLoanData();
    }
  }, [loanId]);

  const loadLoanData = async () => {
    try {
      const loanDoc = await getDoc(doc(db, 'loans', loanId));
      if (loanDoc.exists()) {
        const data = loanDoc.data();
        setLoanData({
          type: data.type || 'personal Loan',
          amount: data.amount || '',
          tenure: data.tenure || '',
          income: data.income || '',
          cibil: data.cibil || '',
          purpose: data.purpose || '',
          employmentType: data.employmentType || 'salaried'
        });
        
        if (data.personalInfo) {
          setPersonalInfo(data.personalInfo);
        }
        
        if (data.docs) {
          const updatedDocs = { ...documents };
          Object.keys(data.docs).forEach(key => {
            if (updatedDocs[key]) {
              updatedDocs[key] = {
                url: data.docs[key],
                status: 'uploaded',
                verified: data.verified && data.verified[key] || false
              };
            }
          });
          setDocuments(updatedDocs);
        }

        // Determine current step based on completion
        if (data.status === 'submitted') {
          setCurrentStep(5);
        } else if (data.docs && Object.keys(data.docs).length > 0) {
          setCurrentStep(4);
        } else if (data.personalInfo) {
          setCurrentStep(3);
        } else if (data.amount) {
          setCurrentStep(2);
        }
      }
    } catch (error) {
      console.error('Error loading loan data:', error);
      setError('Failed to load existing loan data');
    }
  };

  // Fixed file upload function
  const handleFileUpload = async (file, documentType) => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploadingDoc(documentType);
    setError('');
    
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "loan-app"); 
      data.append("cloud_name", "dr1gpbjgg"); 

      const res = await fetch("https://api.cloudinary.com/v1_1/dr1gpbjgg/image/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const uploadedImage = await res.json();
      
      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          url: uploadedImage.secure_url,
          status: 'uploaded',
          verified: false
        }
      }));

      setSuccess(`${documentType} uploaded successfully!`);
      
      // Auto-save to database
      await saveLoanData();
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Failed to upload ${documentType}. Please try again.`);
    } finally {
      setUploadingDoc('');
    }
  };

  // Individual upload handlers
  const handleAadhaarUpload = (event) => {
    const file = event.target.files[0];
    if (file) handleFileUpload(file, "aadhaar");
  };

  const handlePanUpload = (event) => {
    const file = event.target.files[0];
    if (file) handleFileUpload(file, "pan");
  };

  const handleBankStatementUpload = (event) => {
    const file = event.target.files[0];
    if (file) handleFileUpload(file, "bankStatement");
  };

  const handleItrUpload = (event) => {
    const file = event.target.files[0];
    if (file) handleFileUpload(file, "itr");
  };

  // Quick verification (2-second fake verification)
  const verifyDocument = async (docType) => {
    setVerifyingDoc(docType);
    setError('');
    
    try {
      // 2-second verification simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Always verify successfully
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          status: 'verified',
          verified: true
        }
      }));

      setSuccess(`${docType.toUpperCase()} verified successfully!`);
      
      // Auto-save verification status
      await saveLoanData();
      
    } catch (error) {
      setError(`Verification failed for ${docType}`);
    } finally {
      setVerifyingDoc('');
    }
  };

  // Fixed save function
  const saveLoanData = async (stepData = {}) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      const loanRef = loanId ? doc(db, 'loans', loanId) : doc(collection(db, 'loans'));
      
      const loanDocument = {
        userId: user.uid,
        ...loanData,
        ...stepData,
        personalInfo,
        docs: Object.entries(documents)
          .filter(([_, doc]) => doc.url)
          .reduce((acc, [key, doc]) => ({ ...acc, [key]: doc.url }), {}),
        verified: Object.entries(documents)
          .filter(([_, doc]) => doc.verified)
          .reduce((acc, [key, doc]) => ({ ...acc, [key]: doc.verified }), {}),
        updatedAt: new Date(),
        status: stepData.status || 'pending-verification'
      };

      if (!loanId) {
        loanDocument.createdAt = new Date();
      }

      await setDoc(loanRef, loanDocument, { merge: true });
      
      if (!loanId) {
        // Redirect to the new loan application page
        const newLoanId = loanRef.id;
        router.push(`/loan-application/${newLoanId}`);
      }
      
      return loanRef.id;
    } catch (error) {
      console.error('Error saving loan data:', error);
      setError('Failed to save data. Please try again.');
      throw error;
    }
  };

  const handleNext = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Validation for each step
      if (currentStep === 1) {
        if (!loanData.amount || !loanData.tenure || !loanData.income) {
          setError('Please fill in all required loan details');
          return;
        }
        if (parseInt(loanData.amount) < 10000 || parseInt(loanData.amount) > 5000000) {
          setError('Loan amount must be between ₹10,000 and ₹50,00,000');
          return;
        }
        await saveLoanData();
      }
      
      if (currentStep === 2) {
        if (!personalInfo.fullName || !personalInfo.dateOfBirth || !personalInfo.phone) {
          setError('Please fill in all required personal information');
          return;
        }
        await saveLoanData({ personalInfo });
      }
      
      if (currentStep === 3) {
        const uploadedDocs = Object.values(documents).filter(doc => doc.url);
        if (uploadedDocs.length === 0) {
          setError('Please upload at least one document');
          return;
        }
      }
      
      if (currentStep === 4) {
        const verifiedDocs = Object.values(documents).filter(doc => doc.verified);
        if (verifiedDocs.length === 0) {
          setError('Please verify at least one document');
          return;
        }
      }

      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      setSuccess('');
    } catch (error) {
      setError('Failed to save progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await saveLoanData({ 
        status: 'submitted',
        submittedAt: new Date()
      });
      
      setSuccess('Loan application submitted successfully! You will receive updates via email.');
    } catch (error) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex-1 flex flex-col min-w-screen min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const StepIcon = step.icon;
                
                return (
                  <li key={step.id} className="relative flex-1">
                    <div className="flex items-center">
                      <div className={`
                        relative flex h-10 w-10 items-center justify-center rounded-full border-2 
                        ${status === 'completed' ? 'border-green-600 bg-green-600' : 
                          status === 'current' ? 'border-blue-600 bg-blue-600' : 
                          'border-gray-300 bg-white'}
                      `}>
                        <StepIcon className={`h-5 w-5 ${
                          status === 'completed' || status === 'current' ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <p className={`text-sm font-medium ${
                          status === 'current' ? 'text-blue-600' : 
                          status === 'completed' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <div className="flex">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          {/* Step 1: Loan Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Loan Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Type *
                  </label>
                  <select
                    value={loanData.type}
                    onChange={(e) => setLoanData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {loanTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={loanData.amount}
                    onChange={(e) => setLoanData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="e.g., 200000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenure (months) *
                  </label>
                  <select
                    value={loanData.tenure}
                    onChange={(e) => setLoanData(prev => ({ ...prev, tenure: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select tenure</option>
                    {tenureOptions.map(tenure => (
                      <option key={tenure} value={tenure}>{tenure} months</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income (₹) *
                  </label>
                  <input
                    type="number"
                    value={loanData.income}
                    onChange={(e) => setLoanData(prev => ({ ...prev, income: e.target.value }))}
                    placeholder="e.g., 40000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CIBIL Score (optional)
                  </label>
                  <input
                    type="number"
                    value={loanData.cibil}
                    onChange={(e) => setLoanData(prev => ({ ...prev, cibil: e.target.value }))}
                    placeholder="e.g., 650"
                    min="300"
                    max="900"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={loanData.employmentType}
                    onChange={(e) => setLoanData(prev => ({ ...prev, employmentType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business Owner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Loan
                </label>
                <textarea
                  value={loanData.purpose}
                  onChange={(e) => setLoanData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="Brief description of loan purpose"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={personalInfo.gender}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={personalInfo.maritalStatus}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, maritalStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={personalInfo.state}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={personalInfo.pincode}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.companyName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 text-center">Upload Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar Card */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Card *
                  </label>
                  {!documents.aadhaar.url ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleAadhaarUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {uploadingDoc === 'aadhaar' && (
                        <div className="flex items-center mt-2 text-blue-600">
                          <Loader className="animate-spin h-4 w-4 mr-2" />
                          Uploading...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Document uploaded successfully
                      </div>
                      <button
                        onClick={() => setDocuments(prev => ({
                          ...prev,
                          aadhaar: { url: '', status: 'pending', verified: false }
                        }))}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove and re-upload
                      </button>
                    </div>
                  )}
                </div>

                {/* PAN Card */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Card *
                  </label>
                  {!documents.pan.url ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handlePanUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {uploadingDoc === 'pan' && (
                        <div className="flex items-center mt-2 text-blue-600">
                          <Loader className="animate-spin h-4 w-4 mr-2" />
                          Uploading...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Document uploaded successfully
                      </div>
                      <button
                        onClick={() => setDocuments(prev => ({
                          ...prev,
                          pan: { url: '', status: 'pending', verified: false }
                        }))}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove and re-upload
                      </button>
                    </div>
                  )}
                </div>

                                {/* Bank Statement */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Statement *
                  </label>
                  {!documents.bankStatement.url ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleBankStatementUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {uploadingDoc === 'bankStatement' && (
                        <div className="flex items-center mt-2 text-blue-600">
                          <Loader className="animate-spin h-4 w-4 mr-2" />
                          Uploading...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Document uploaded successfully
                      </div>
                      <button
                        onClick={() => setDocuments(prev => ({
                          ...prev,
                          bankStatement: { url: '', status: 'pending', verified: false }
                        }))}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove and re-upload
                      </button>
                    </div>
                  )}
                </div>

                {/* ITR (Optional) */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ITR (Income Tax Return) - Optional
                  </label>
                  {!documents.itr.url ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleItrUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {uploadingDoc === 'itr' && (
                        <div className="flex items-center mt-2 text-blue-600">
                          <Loader className="animate-spin h-4 w-4 mr-2" />
                          Uploading...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Document uploaded successfully
                      </div>
                      <button
                        onClick={() => setDocuments(prev => ({
                          ...prev,
                          itr: { url: '', status: 'pending', verified: false }
                        }))}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove and re-upload
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Document Requirements</p>
                    <p className="text-sm text-blue-700 mt-1">
                      • Aadhaar Card: Front and back side in a single file<br/>
                      • PAN Card: Clear image of both sides<br/>
                      • Bank Statement: Last 6 months statement in PDF format<br/>
                      • ITR: Last 2 years returns (if available)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Verification */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Document Verification</h3>
              
              <div className="space-y-4">
                {Object.entries(documents)
                  .filter(([_, doc]) => doc.url)
                  .map(([docType, doc]) => {
                    const docLabels = {
                      aadhaar: 'Aadhaar Card',
                      pan: 'PAN Card',
                      bankStatement: 'Bank Statement',
                      itr: 'Income Tax Return'
                    };

                    return (
                      <div key={docType} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{docLabels[docType]}</p>
                            <p className="text-xs text-gray-500">
                              {doc.status === 'verified' ? 'Verified successfully' :
                              doc.status === 'uploaded' ? 'Pending verification' :
                              'Not uploaded'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {doc.status === 'uploaded' && (
                            <button
                              onClick={() => verifyDocument(docType)}
                              disabled={verifyingDoc === docType}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                              {verifyingDoc === docType ? (
                                <span className="flex items-center">
                                  <Loader className="animate-spin h-4 w-4 mr-2" />
                                  Verifying...
                                </span>
                              ) : 'Verify Document'}
                            </button>
                          )}
                          
                          {doc.status === 'verified' && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-6 h-6 mr-2" />
                              Verified
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <Clock className="w-5 h-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Verification Process</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Our system will verify your documents automatically. This process usually takes 2-3 minutes.
                      Please ensure all documents are clear and readable for faster verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Review Your Application</h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Loan Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Loan Type:</span> {loanTypes.find(t => t.value === loanData.type)?.label}</div>
                  <div><span className="text-gray-600">Amount:</span> ₹{loanData.amount}</div>
                  <div><span className="text-gray-600">Tenure:</span> {loanData.tenure} months</div>
                  <div><span className="text-gray-600">Monthly Income:</span> ₹{loanData.income}</div>
                  <div><span className="text-gray-600">CIBIL Score:</span> {loanData.cibil || 'Not provided'}</div>
                  <div><span className="text-gray-600">Purpose:</span> {loanData.purpose || 'Not specified'}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Full Name:</span> {personalInfo.fullName}</div>
                  <div><span className="text-gray-600">Date of Birth:</span> {personalInfo.dateOfBirth}</div>
                  <div><span className="text-gray-600">Gender:</span> {personalInfo.gender || 'Not specified'}</div>
                  <div><span className="text-gray-600">Marital Status:</span> {personalInfo.maritalStatus || 'Not specified'}</div>
                  <div><span className="text-gray-600">Phone:</span> {personalInfo.phone}</div>
                  <div><span className="text-gray-600">Email:</span> {personalInfo.email}</div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Address:</span> {personalInfo.address}
                  </div>
                  <div><span className="text-gray-600">City:</span> {personalInfo.city}</div>
                  <div><span className="text-gray-600">State:</span> {personalInfo.state}</div>
                  <div><span className="text-gray-600">PIN Code:</span> {personalInfo.pincode}</div>
                  <div><span className="text-gray-600">Company:</span> {personalInfo.companyName || 'Not specified'}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Documents Status</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(documents).map(([docType, doc]) => {
                    const docLabels = {
                      aadhaar: 'Aadhaar Card',
                      pan: 'PAN Card',
                      bankStatement: 'Bank Statement',
                      itr: 'Income Tax Return'
                    };
                    
                    return (
                      <div key={docType} className="flex items-center justify-between">
                        <span className="text-gray-600">{docLabels[docType]}:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                          doc.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Important Notice</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      By submitting this application, you confirm that all information provided is accurate and complete.
                      Any false information may lead to rejection of your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EKYCWorkflow;