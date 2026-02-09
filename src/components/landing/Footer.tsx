import React from 'react';
import { GraduationCap, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={28} className="text-united-blue" strokeWidth={2.5} />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                UnitEd
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Connecting students and faculty for research, projects, and hackathons through AI-powered matching.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <button key={i} className="p-2 text-gray-400 hover:text-united-blue hover:bg-blue-500/10 rounded-full transition-colors">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            {['About Us', 'How It Works', 'Features', 'Pricing', 'FAQ'].map((item) => (
              <a key={item} href="#" className="block text-gray-400 text-sm mb-2 hover:text-united-blue transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            {['Browse Opportunities', 'Create Profile', 'Apply to Projects', 'Join Teams', 'Resources'].map((item) => (
              <a key={item} href="#" className="block text-gray-400 text-sm mb-2 hover:text-united-blue transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Creator Info */}
          <div>
            <h4 className="font-semibold mb-4">Created By</h4>
            <div className="flex items-start gap-3 mb-3">
              <Mail size={18} className="text-gray-400 mt-0.5 shrink-0" />
              <span className="text-gray-400 text-sm">210040017@anits.edu.in</span>
            </div>
            <div className="flex items-start gap-3 mb-3">
              <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
              <span className="text-gray-400 text-sm">+91 9985949494</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
              <span className="text-gray-400 text-sm leading-relaxed">
                Anil Neerukonda Institute of Technology & Sciences<br />
                Sangivalasa, Bheemunipatnam Mandal<br />
                Visakhapatnam, AP 531162
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {currentYear} UnitEd. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-gray-400 text-sm hover:text-united-blue transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
