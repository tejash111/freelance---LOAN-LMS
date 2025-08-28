"use client"
import { ChevronRight, CreditCard, HelpCircle, LayoutDashboard, Package, Phone, Settings, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true ,link : '/admin/dashboard'},
    { icon: Package, label: 'Products', hasSubmenu: true },
    { icon: Users, label: 'Leads', hasSubmenu: true ,link : '/admin/lead'},
    { icon: Users, label: 'Teams', hasSubmenu: true ,link : '/admin/lead/add'},
    { icon: Phone, label: 'Calls', hasSubmenu: true ,link : '/admin/lead/add'},
    { icon: CreditCard, label: 'Accounts', hasSubmenu: true,link : '/admin/lead/add' },
    { icon: Settings, label: 'Supporting Tools', hasSubmenu: true ,link : '/admin/lead/add'},
    { icon: HelpCircle, label: 'Help Center', hasSubmenu: true,link : '/admin/lead/add' },
    { icon: Settings, label: 'Settings', hasSubmenu: true ,link : '/admin/lead/add'}
  ];
export default function AgentLayout({ children }) {
    const router = useRouter()
  return (
    <html lang="en">
      <div className="flex overflow-none">
          {/* Sidebar */}
      <div className="min-w-64 bg-white shadow-xl rounded-r-2xl border-r border-blue-100">
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
            <div onClick={()=>router.push(item.link)} key={index} className={`mb-2 ${item.active ? 'bg-blue-50 rounded-xl' : ''}`}>
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
        {children}
    
     </div>
    </html>
  );
}
