"use client"
import ProtectedRoute from '../components/Protectedroute';
import { useAuth } from '../../hooks/useAuth';
import EKYCWorkflow from './kyc';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';

const UserDashboard = () => {
    const { user } = useAuth();

  

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ User is logged in:", user);
  } else {
    console.log("❌ No user logged in");
  }
});

    
    
    

    return (
     
            <div>
               hey
               
            </div>
       
    );
};

export default UserDashboard;