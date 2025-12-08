import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  // Mock cart count
  const cartCount = 2; 

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <FaLeaf className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">DairyMart</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-emerald-600 font-medium transition">Products</Link>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600 font-medium transition">Our Farm</Link>
            
            <div className="flex items-center gap-4 ml-4">
              <Link to="/cart" className="relative text-gray-600 hover:text-emerald-600 transition">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {userId ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="text-gray-600 hover:text-emerald-600"><FaUser className="text-xl"/></Link>
                  <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-600">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition shadow-md hover:shadow-lg">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">Home</Link>
            <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">Products</Link>
            <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">Cart ({cartCount})</Link>
            {userId ? (
               <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Logout</button>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-emerald-600 hover:bg-emerald-50 rounded-md">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;