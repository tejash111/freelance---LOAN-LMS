"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../../firebase/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Upload, CheckCircle, AlertCircle, Clock, FileText, User, CreditCard, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EKYCWorkflow = ({ loanId }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loanData, setLoanData] = useState({
    type: 'personal',
    amount: '',
    tenure: '',
    income: '',
    cibil: '',
    purpose: '',
    employmentType: 'salaried'
  });

  const [documents, setDocuments] = useState({
    aadhaar: { file: null, url: '', status: 'pending', verified: false },
    pan: { file: null, url: '', status: 'pending', verified: false },
    salarySlip: { file: null, url: '', status: 'pending', verified: false },
    bankStatement: { file: null, url: '', status: 'pending', verified: false }
  });

  const router=useRouter();

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
    { value: 'personal', label: 'Personal Loan' },
    { value: 'home', label: 'Home Loan' },
    { value: 'car', label: 'Car Loan' },
    { value: 'business', label: 'Business Loan' }
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
          type: data.type || 'personal',
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
              updatedDocs[key].url = data.docs[key];
              updatedDocs[key].status = 'uploaded';
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
    }
  };

  // Simulate file upload (replace with actual Firebase Storage upload)
  const handleFileUpload = async (docType, file) => {
  if (!file) return;

  setLoading(true);
  setError(''); // Clear any previous errors
  
  try {
    // Basic file validation
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG, and PDF files are allowed');
    }

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create fake URL for demo purposes
    const mockUrl = `https://storage.example.com/${user?.uid || 'demo-user'}/${docType}/${Date.now()}_${file.name}`;
    
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        file,
        url: mockUrl,
        status: 'uploaded',
        verified: false
      }
    }));

    setSuccess(`${docType.charAt(0).toUpperCase() + docType.slice(1)} uploaded successfully`);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
    
  } catch (error) {
    console.error('Upload error:', error);
    setError(`Failed to upload ${docType}: ${error.message}`);
    
    // Reset the file selection
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        file: null
      }
    }));
  } finally {
    setLoading(false);
  }
};

  // Simulate document verification
  const verifyDocument = async (docType) => {
    setLoading(true);
    try {
      // Simulate verification API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock verification result (90% success rate)
      const isVerified = Math.random() > 0.1;
      
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          status: isVerified ? 'verified' : 'rejected',
          verified: isVerified
        }
      }));

      if (isVerified) {
        setSuccess(`${docType.toUpperCase()} verified successfully`);
      } else {
        setError(`${docType.toUpperCase()} verification failed. Please re-upload.`);
      }
    } catch (error) {
      setError(`Verification failed for ${docType}`);
    } finally {
      setLoading(false);
    }
  };

  const saveLoanData = async (stepData = {}) => {
    if (!user) return;

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
        updatedAt: new Date()
      };

      if (!loanId) {
        loanDocument.createdAt = new Date();
        loanDocument.status = 'pending-verification';
      }

      await setDoc(loanRef, loanDocument, { merge: true });
      
      if (!loanId) {
        // Set loanId for new applications
        router.push(`/loan-application/${loanRef.id}`);
      }
      
      return loanRef.id;
    } catch (error) {
      console.error('Error saving loan data:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    setError('');
    
    try {
      // Validate current step
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
        const requiredDocs = ['aadhaar', 'pan', 'salarySlip'];
        const uploadedDocs = requiredDocs.filter(doc => documents[doc].url);
        if (uploadedDocs.length < requiredDocs.length) {
          setError('Please upload all required documents');
          return;
        }
      }
      
      if (currentStep === 4) {
        const verifiedDocs = Object.values(documents).filter(doc => doc.verified);
        if (verifiedDocs.length < 3) {
          setError('Please complete document verification');
          return;
        }
      }

      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } catch (error) {
      setError('Failed to save progress. Please try again.');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50 py-8">
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
              <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(documents).map(([docType, doc]) => {
                  const docLabels = {
                    aadhaar: 'Aadhaar Card',
                    pan: 'PAN Card',
                    salarySlip: 'Salary Slip',
                    bankStatement: 'Bank Statement'
                  };

                  return (
                    <div key={docType} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {docLabels[docType]} {['aadhaar', 'pan', 'salarySlip'].includes(docType) && '*'}
                        </h4>
                        <div className={`px-2 py-1 rounded text-xs ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                          doc.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </div>
                      </div>

                      {!doc.url ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setDocuments(prev => ({
                                  ...prev,
                                  [docType]: { ...prev[docType], file }
                                }));
                              }
                            }}
                            className="hidden"
                            id={`file-${docType}`}
                          />
                          <label
                            htmlFor={`file-${docType}`}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload</p>
                            <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
                          </label>
                          
                          {doc.file && (
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-sm text-gray-600">{doc.file.name}</span>
                              <button
                                onClick={() => handleFileUpload(docType, doc.file)}
                                disabled={loading}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                              >
                                {loading ? 'Uploading...' : 'Upload'}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Document uploaded successfully
                          </div>
                          <button
                            onClick={() => setDocuments(prev => ({
                              ...prev,
                              [docType]: { file: null, url: '', status: 'pending', verified: false }
                            }))}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove and re-upload
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
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
            salarySlip: 'Salary Slip',
            bankStatement: 'Bank Statement'
          };

          return (
            <div key={docType} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{docLabels[docType]}</p>
                  <p className="text-xs text-gray-500">
                    {doc.status === 'verified' ? 'Verified successfully' :
                     doc.status === 'rejected' ? 'Verification failed' :
                     'Pending verification'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {doc.status === 'uploaded' && (
                  <button
                    onClick={() => verifyDocument(docType)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify Document'}
                  </button>
                )}
                
                {doc.status === 'verified' && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                
                {doc.status === 'rejected' && (
                  <div className="flex items-center">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                    <button
                      onClick={() => setDocuments(prev => ({
                        ...prev,
                        [docType]: { ...prev[docType], status: 'uploaded', verified: false }
                      }))}
                      className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200"
                    >
                      Re-upload
                    </button>
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
            salarySlip: 'Salary Slip',
            bankStatement: 'Bank Statement'
          };
          
          return (
            <div key={docType} className="flex items-center justify-between">
              <span className="text-gray-600">{docLabels[docType]}:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                doc.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
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