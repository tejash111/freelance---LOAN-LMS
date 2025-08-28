"use client"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { db } from '../../../../firebase/firebase' // Adjust path as needed
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { User, Phone, Mail, Calendar, MapPin, Briefcase, Trash2, Eye, Edit, Plus, Search, Filter } from 'lucide-react'

const LeadPage = () => {
  const router = useRouter()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Fetch leads from Firebase
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const leadsRef = collection(db, 'loans') // Assuming leads collection
      const q = query(leadsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const leadsData = []
      querySnapshot.forEach((doc) => {
        leadsData.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      setLeads(leadsData)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setError('Failed to fetch leads. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Delete lead
  const deleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteDoc(doc(db, 'loans', leadId))
        setLeads(leads.filter(lead => lead.id !== leadId))
      } catch (error) {
        console.error('Error deleting lead:', error)
        setError('Failed to delete lead. Please try again.')
      }
    }
  }

  // Filter and search leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm)
    
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
      // Handle Firestore Timestamp
      if (date.toDate) {
        return date.toDate().toLocaleDateString()
      }
      // Handle regular Date object
      return new Date(date).toLocaleDateString()
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'converted':
        return 'bg-purple-100 text-purple-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className='bg-gradient-to-br min-h-screen from-blue-50 to-indigo-50 w-full flex justify-center items-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-gradient-to-br min-h-screen from-blue-50 to-indigo-50 w-full'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Lead Management</h1>
            <p className='text-gray-600'>Manage and track your leads</p>
          </div>
          
          <button
            onClick={() => router.push('/admin/lead/add')}
            className='bg-gradient-to-r from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200'
          >
            <Plus className='w-5 h-5' />
            Add New Lead
          </button>
        </div>

        {/* Search and Filter */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            
            <div className='flex items-center gap-2'>
              <Filter className='w-5 h-5 text-gray-400' />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6'>
            {error}
          </div>
        )}

        {/* Leads Count */}
        <div className='mb-4'>
          <p className='text-gray-600'>
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
        </div>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <div className='bg-white rounded-lg shadow-md p-8 text-center'>
            <User className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>No leads found</h3>
            <p className='text-gray-500 mb-4'>
              {leads.length === 0 ? 'Get started by adding your first lead.' : 'Try adjusting your search or filter criteria.'}
            </p>
            {leads.length === 0 && (
              <button
                onClick={() => router.push('/admin/lead/add')}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200'
              >
                Add Your First Lead
              </button>
            )}
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredLeads.map((lead) => (
              <div key={lead.id} className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6'>
                {/* Lead Header */}
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold'>
                      {lead.fullName ? lead.fullName.charAt(0).toUpperCase() : 'L'}
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900 text-lg'>{lead.fullName || 'Unknown'}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status || 'New'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lead Details */}
                <div className='space-y-3 mb-4'>
                  {lead.email && (
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Mail className='w-4 h-4' />
                      <span className='text-sm truncate'>{lead.email}</span>
                    </div>
                  )}
                  
                  {lead.phone && (
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Phone className='w-4 h-4' />
                      <span className='text-sm'>{lead.phone}</span>
                    </div>
                  )}
                  
                  {lead.city && (
                    <div className='flex items-center gap-2 text-gray-600'>
                      <MapPin className='w-4 h-4' />
                      <span className='text-sm'>{lead.city}</span>
                    </div>
                  )}
                  
                  {lead.loanType && (
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Briefcase className='w-4 h-4' />
                      <span className='text-sm capitalize'>{lead.loanType} Loan</span>
                    </div>
                  )}
                  
                  <div className='flex items-center gap-2 text-gray-600'>
                    <Calendar className='w-4 h-4' />
                    <span className='text-sm'>{formatDate(lead.createdAt)}</span>
                  </div>
                </div>

                {/* Loan Amount if available */}
                {lead.loanAmount && (
                  <div className='mb-4 p-3 bg-green-50 rounded-md'>
                    <p className='text-sm text-green-800'>
                      <span className='font-medium'>Loan Amount:</span> ₹{parseInt(lead.loanAmount).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className='flex gap-2 pt-4 border-t border-gray-100'>
                  <button
                    onClick={() => router.push(`/admin/lead/view/${lead.id}`)}
                    className='flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200'
                  >
                    <Eye className='w-4 h-4' />
                    View
                  </button>
                  
                  <button
                    onClick={() => router.push(`/admin/lead/edit/${lead.id}`)}
                    className='flex-1 flex items-center justify-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200'
                  >
                    <Edit className='w-4 h-4' />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className='flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200'
                  >
                    <Trash2 className='w-4 h-4' />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LeadPage