import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Phone, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  ChevronRight,
  Menu,
  Search,
  Calculator,
  BarChart3,
  FileText,
  User,
  Star,
  X,
  Filter,
  Download,
  ChevronDown,
  Bell,
  MessageSquare
} from 'lucide-react';

const AdminDashboardMain = () => {
  const [activeFilter, setActiveFilter] = useState({
    length: '10',
    dateRange: '08/25/2025 - 08/25/2025',
    bankProduct: '',
    customerName: '',
    phoneNumber: '',
    pancardNumber: '',
    leadSource: '',
    leadStatus: '',
    grabStatus: '',
    bankerStatus: '',
    activeLead: ''
  });

  const sampleLeads = [
    {
      id: 1,
      leadId: '4A234334',
      updatedOn: 'Aug 23, 2025',
      createdOn: 'Aug 23, 2025',
      leadSource: 'Backend',
      customerName: 'Sumit Kumar',
      panNumber: 'NA',
      mobile: '9667420223',
      email: 'paywisefintech@gmail.com',
      product: 'Personal Loan'
    },
    {
      id: 2,
      leadId: '783A234052',
      updatedOn: 'Aug 21, 2025',
      createdOn: 'Aug 21, 2025',
      leadSource: 'Backend',
      customerName: 'Lead',
      panNumber: 'NA',
      mobile: '9451121215',
      email: 'Lead987@gmail.com',
      product: 'Loan Against Property'
    },
    {
      id: 3,
      leadId: '935A234051',
      updatedOn: 'Aug 21, 2025',
      createdOn: 'Aug 21, 2025',
      leadSource: 'Backend',
      customerName: 'Motor',
      panNumber: 'NA',
      mobile: '9712315462',
      email: 'Motor987@gmail.com',
      product: 'Motor Insurance'
    },
    {
      id: 4,
      leadId: '1104A234050',
      updatedOn: 'Aug 21, 2025',
      createdOn: 'Aug 21, 2025',
      leadSource: 'Backend',
      customerName: 'General',
      panNumber: 'NA',
      mobile: '9818445154',
      email: 'General987@gmail.com',
      product: 'General Insurance'
    },
    {
      id: 5,
      leadId: '912A234049',
      updatedOn: 'Aug 21, 2025',
      createdOn: 'Aug 21, 2025',
      leadSource: 'Backend',
      customerName: 'Life',
      panNumber: 'NA',
      mobile: '9214895623',
      email: 'Life987@gmail.com',
      product: 'Life Insurance'
    },
    {
      id: 6,
      leadId: '903A234048',
      updatedOn: 'Aug 21, 2025',
      createdOn: 'Aug 21, 2025',
      leadSource: 'Backend',
      customerName: 'Health',
      panNumber: 'NA',
      mobile: '8945621322',
      email: 'Health987@gmail.com',
      product: 'Health Insurance'
    }
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Package, label: 'Products', hasSubmenu: true },
    { icon: Users, label: 'Leads', hasSubmenu: true },
    { icon: Users, label: 'Teams', hasSubmenu: true },
    { icon: Phone, label: 'Calls', hasSubmenu: true },
    { icon: CreditCard, label: 'Accounts', hasSubmenu: true },
    { icon: Settings, label: 'Supporting Tools', hasSubmenu: true },
    { icon: HelpCircle, label: 'Help Center', hasSubmenu: true },
    { icon: Settings, label: 'Settings', hasSubmenu: true }
  ];

  return (
    <div className="flex  bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl rounded-r-2xl border-r border-blue-100">
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-xl text-blue-800">LoanPro</span>
          </div>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="px-3 mb-4">
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">DASHBOARD</span>
          </div>
          {menuItems.map((item, index) => (
            <div key={index} className={`mb-2 ${item.active ? 'bg-blue-50 rounded-xl' : ''}`}>
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${item.active ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.hasSubmenu && <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-blue-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Menu className="w-6 h-6 text-blue-600 cursor-pointer" />
              <div className="relative">
                <select className="bg-blue-50 border-0 rounded-xl px-4 py-2 text-sm text-blue-800 appearance-none pr-8">
                  <option>Select Language</option>
                </select>
                <ChevronDown className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              <button className="text-sm text-blue-700 hover:text-blue-900 transition-colors">Search by Pincode</button>
              <button className="text-sm text-blue-700 hover:text-blue-900 transition-colors flex items-center space-x-1">
                <Calculator className="w-4 h-4" />
                <span>Eligibility Calculator</span>
              </button>
              <button className="text-sm text-blue-700 hover:text-blue-900 transition-colors flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span>Compare ROI</span>
              </button>
              <button className="text-sm text-blue-700 hover:text-blue-900 transition-colors flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Cibil Report</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-blue-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <MessageSquare className="w-6 h-6 text-blue-600 cursor-pointer" />
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                P
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6 rounded-2xl mx-6 mt-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold">Hi, PAYWISE FINTECH PRIVATE LIMITED!</h1>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center space-x-8 text-sm">
              <div className="text-center bg-white/10 py-2 px-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-1">
                  <span>My Rating</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <span>(14,873)</span>
                </div>
              </div>
              <div className="text-center bg-white/10 py-2 px-4 rounded-xl">
                <div className="text-blue-100">Total Banks</div>
                <div className="text-2xl font-bold">255</div>
              </div>
              <div className="text-center bg-white/10 py-2 px-4 rounded-xl">
                <div className="text-blue-100">Total Products</div>
                <div className="text-2xl font-bold">13</div>
              </div>
              <div className="text-center bg-white/10 py-2 px-4 rounded-xl">
                <div className="text-blue-100">My Team</div>
                <div className="text-2xl font-bold">1</div>
              </div>
              <div className="text-center bg-white/10 py-2 px-4 rounded-xl">
                <div className="text-blue-100">My Leads</div>
                <div className="text-2xl font-bold">19</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='cursor-pointer bg-gradient-to-r from-teal-700 to-green-500 text-white px-8 py-6 rounded-2xl mx-6 mt-6 shadow-lg text-xl'>
          Add Lead
        </div>

        {/* Filters */}
        <div className="bg-white px-8 py-6 rounded-2xl mx-6 mt-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blue-800">Lead Filters</h2>
            <div className="flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all">
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all">
                Clear
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Length</label>
              <div className="relative">
                <select className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50 appearance-none pr-8">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <ChevronDown className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Date Range</label>
              <input 
                type="text" 
                value="08/25/2025 - 08/25/2025"
                className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Bank Product</label>
              <div className="relative">
                <select className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50 appearance-none pr-8">
                  <option>Select Bank Product</option>
                </select>
                <ChevronDown className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Customer Name</label>
              <input 
                type="text" 
                placeholder="Customer Name"
                className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Phone Number</label>
              <input 
                type="text" 
                placeholder="Customer Mobile"
                className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Pancard Number</label>
              <input 
                type="text" 
                placeholder="Pancard Number"
                className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Lead Source</label>
              <div className="relative">
                <select className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50 appearance-none pr-8">
                  <option>Select Lead Source</option>
                </select>
                <ChevronDown className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Lead Status</label>
              <div className="relative">
                <select className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50 appearance-none pr-8">
                  <option>Select Lead Status</option>
                </select>
                <ChevronDown className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Grab Status</label>
              <div className="relative">
                <select className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50 appearance-none pr-8">
                  <option>Select Grab Status</option>
                </select>
                <ChevronDown className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Banker Status</label>
              <div className="relative">
                <select className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50 appearance-none pr-8">
                  <option>Select Banker Status</option>
                </select>
                <ChevronDown className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">Active Lead</label>
              <div className="relative">
                <select className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm bg-blue-50 appearance-none pr-8">
                  <option>Select Active Lead</option>
                </select>
                <ChevronDown className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto  mx-6 my-6 bg-white rounded-2xl shadow-lg border border-blue-100">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold first:rounded-tl-2xl">S.NO.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">LEAD ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">UPDATED ON</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">CREATED ON</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">LEAD SOURCE</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">CUSTOMER NAME</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">PAN NUMBER</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">MOBILE</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">EMAIL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold last:rounded-tr-2xl">PRODUCT</th>
              </tr>
            </thead>
            <tbody>
              {sampleLeads.map((lead, index) => (
                <tr key={lead.id} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                  <td className="px-6 py-4 text-sm text-blue-900 font-medium">{lead.id}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{lead.leadId}</td>
                  <td className="px-6 py-4 text-sm text-blue-900">{lead.updatedOn}</td>
                  <td className="px-6 py-4 text-sm text-blue-900">{lead.createdOn}</td>
                  <td className="px-6 py-4 text-sm text-blue-900">{lead.leadSource}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{lead.customerName}</td>
                  <td className="px-6 py-4 text-sm text-blue-900">{lead.panNumber}</td>
                  <td className="px-6 py-4 text-sm text-blue-900">{lead.mobile}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{lead.email}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-semibold">{lead.product}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;