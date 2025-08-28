"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, Users, FileText, CreditCard, PieChart } from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  
  const months = ['Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 'Jan 25'];
  
  const financialData = {
    'Aug 24': {
      totalLoans: '$1,850,000',
      activeLoans: '-$125,500',
      avgLoanTerm: '3y 6mo',
      defaultRate: '2.3%',
      cash: '$1.2M',
      disbursed: '($95,200)',
      portfolio: '$428,500',
      income: '$65,800',
      expenses: '($42,100)',
      funding: '$750,000'
    },
    'Sep 24': {
      totalLoans: '$2,100,000',
      activeLoans: '-$98,200',
      avgLoanTerm: '3y 8mo',
      defaultRate: '1.9%',
      cash: '$1.4M',
      disbursed: '($108,400)',
      portfolio: '$485,200',
      income: '$72,500',
      expenses: '($48,300)',
      funding: '$800,000'
    },
    'Oct 24': {
      totalLoans: '$2,309,091',
      activeLoans: '-$41,206',
      avgLoanTerm: '4y 8mo',
      defaultRate: '1.2%',
      cash: '$1.8M',
      disbursed: '($118,878)',
      portfolio: '$548,647',
      income: '$82,544',
      expenses: '($61,442)',
      funding: '$900,000'
    },
    'Nov 24': {
      totalLoans: '$2,450,000',
      activeLoans: '-$32,100',
      avgLoanTerm: '4y 2mo',
      defaultRate: '0.8%',
      cash: '$2.1M',
      disbursed: '($125,600)',
      portfolio: '$592,800',
      income: '$89,200',
      expenses: '($58,900)',
      funding: '$950,000'
    },
    'Dec 24': {
      totalLoans: '$2,680,000',
      activeLoans: '-$28,900',
      avgLoanTerm: '4y 5mo',
      defaultRate: '0.6%',
      cash: '$2.3M',
      disbursed: '($132,400)',
      portfolio: '$625,300',
      income: '$95,600',
      expenses: '($62,800)',
      funding: '$1,000,000'
    },
    'Jan 25': {
      totalLoans: '$2,850,000',
      activeLoans: '-$22,500',
      avgLoanTerm: '4y 9mo',
      defaultRate: '0.4%',
      cash: '$2.5M',
      disbursed: '($140,200)',
      portfolio: '$658,900',
      income: '$102,300',
      expenses: '($68,500)',
      funding: '$1,100,000'
    }
  };

  const currentData = financialData[months[currentMonth]];

  const trustedCompanies = [
    'QuickLend',
    'FastCash',
    'LoanStream',
    'CreditFlow',
    'MoneyBridge',
    'LendTech',
    'CashAdvance'
  ];

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % months.length);
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + months.length) % months.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center py-6 border-b border-gray-400">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-blue-800" />
            <span className="text-2xl font-bold text-blue-800">LoanPro</span>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#" className="text-blue-800 hover:text-blue-600 transition-colors font-medium">
              Lenders
            </a>
            <a href="#" className="text-blue-800 hover:text-blue-600 transition-colors font-medium">
              Guide
            </a>
            <a href="#" className="text-blue-800 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </a>
            <a href="#" className="text-blue-800 hover:text-blue-600 transition-colors font-medium">
              Log In
            </a>
            <Link href={'/auth'}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5">
              Get started
            </button>
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="text-center pt-16 pb-20">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm mb-8">
            Loan management best practices to follow →
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-900 mb-6 leading-tight tracking-tight">
            Magically simplify<br />
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              loan management
            </span>
          </h1>
          
          <p className="text-xl text-blue-800 mb-12 max-w-2xl mx-auto leading-relaxed">
            Automated loan processing, effortless portfolio tracking, real-time analytics.<br />
            Set up in 10 mins. Back to lending by 10:24pm.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-1">
              Get started
            </button>
            <button className="text-blue-800 hover:text-blue-600 px-8 py-4 font-semibold text-lg transition-colors">
              Pricing →
            </button>
          </div>
          
          <p className="text-blue-700 text-sm mt-8">
            Currently for US-based lending institutions and credit unions.
          </p>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-blue-900 rounded-2xl border border-blue-700 shadow-2xl overflow-hidden">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-700">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-white" />
              <span className="text-white font-semibold">LoanPro</span>
              <ChevronRight className="h-4 w-4 text-blue-300" />
            </div>
          </div>

          {/* Main Metrics */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {currentData.totalLoans}
                </div>
                <div className="text-blue-200 text-sm">Total Loans</div>
                <div className="text-blue-300 text-xs mt-1">26 mins ago</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-300 mb-2">
                  {currentData.activeLoans}
                </div>
                <div className="text-blue-200 text-sm">Defaults</div>
                <div className="text-blue-300 text-xs mt-1">Jan 1, 2025 - Today</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {currentData.avgLoanTerm}
                </div>
                <div className="text-blue-200 text-sm">Avg Term</div>
                <div className="text-blue-300 text-xs mt-1">Until Sep 2025</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-300 mb-2">
                  {currentData.defaultRate}
                </div>
                <div className="text-blue-200 text-sm">Default Rate</div>
                <div className="text-blue-300 text-xs mt-1">$988,981 ARR</div>
              </div>
            </div>

            {/* Monthly Navigation */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button 
                onClick={prevMonth}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              
              <div className="flex space-x-6">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => setCurrentMonth(index)}
                    className={`px-3 py-1 text-sm transition-colors ${
                      index === currentMonth 
                        ? 'text-white font-semibold bg-blue-700 rounded-md' 
                        : 'text-blue-300 hover:text-white'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={nextMonth}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Detailed Metrics Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-blue-700">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-300" />
                  <span className="text-white font-medium">Cash</span>
                </div>
                <div className="text-white font-semibold">{currentData.cash}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-blue-700">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-300" />
                  <span className="text-white font-medium">Disbursed</span>
                </div>
                <div className="text-red-300 font-semibold">{currentData.disbursed}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-blue-700">
                <div className="flex items-center space-x-3">
                  <PieChart className="h-5 w-5 text-blue-300" />
                  <span className="text-white font-medium">Portfolio</span>
                </div>
                <div className="text-white font-semibold">{currentData.portfolio}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-blue-700">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-blue-300" />
                  <span className="text-white font-medium">Income</span>
                </div>
                <div className="text-green-300 font-semibold">{currentData.income}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-blue-700">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-300" />
                  <span className="text-white font-medium">Expenses</span>
                </div>
                <div className="text-red-300 font-semibold">{currentData.expenses}</div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-300" />
                  <span className="text-white font-medium">Funding</span>
                </div>
                <div className="text-blue-300 font-semibold">{currentData.funding}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by Section */}
        <div className="text-center mt-16">
          <p className="text-blue-800 text-lg mb-8">Trusted by fast-growing lenders</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {trustedCompanies.map((company, index) => (
              <div 
                key={company}
                className="bg-blue-100 px-6 py-3 rounded-lg text-blue-800 font-semibold hover:bg-blue-200 transition-all cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with vertical lines */}
      <footer className="relative py-12 bg-blue-900 text-white mt-20">
        {/* Vertical lines */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">LoanPro</span>
              </div>
              <p className="text-blue-200 mb-4">
                Simplifying loan management for lenders of all sizes with powerful automation and analytics.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Facebook
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Guide</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm">© 2025 LoanPro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;