import React from 'react';
import { Zap, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  onContactClick?: () => void;
  onAboutClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onContactClick, onAboutClick }) => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 text-2xl font-bold mb-6">
              <Zap className="w-8 h-8 text-blue-500" />
              <span>ZELYTE</span>
            </div>
            <p className="text-gray-400 mb-6">
              Premium electrolyte tins crafted for peak performance and natural hydration.
            </p>
            <div className="flex space-x-4">
              <Instagram className="w-6 h-6 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
              <Facebook className="w-6 h-6 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
              <Mail className="w-6 h-6 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Products</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Coconut Citrus</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Berry Blast</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Lemon Lime</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Tropical Mango</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Bundle Packs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={onAboutClick} className="hover:text-blue-500 transition-colors text-left">About Us</button></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Science</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-blue-500 transition-colors">FAQ</a></li>
              <li><button onClick={onContactClick} className="hover:text-blue-500 transition-colors text-left">Contact</button></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Track Order</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Zelyte. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;