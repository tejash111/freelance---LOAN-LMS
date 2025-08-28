"use client"
import ProtectedRoute from '../../components/Protectedroute';
import { useAuth } from '../../../hooks/useAuth';
import AdminDashboardMain from '../../components/admin/adminDashboard';
import Link from 'next/link';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        // <ProtectedRoute requiredRole="admin">
        
            <div >
                <AdminDashboardMain/>
            </div>
        // </ProtectedRoute>
    );
};

export default AdminDashboard;