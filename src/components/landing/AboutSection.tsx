import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

const items = [
  { icon: <Target size={48} />, title: 'Our Mission', description: 'Empower students and faculty with cutting-edge tools for seamless collaboration and innovation' },
  { icon: <Eye size={48} />, title: 'Our Vision', description: 'Building the future of academic networking where AI meets human potential' },
  { icon: <Heart size={48} />, title: 'Our Values', description: 'Innovation, excellence, inclusivity, and data-driven decision making for all' },
];

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24" style={{ backgroundColor: '#DBEAFE' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
          About <span className="text-united-blue">UnitEd</span>
        </h2>
        <p className="text-gray-500 text-center max-w-[900px] mx-auto text-lg leading-relaxed mb-12">
          UnitEd is a comprehensive academic collaboration platform revolutionizing how students and faculty
          connect. With powerful features including AI-powered matching, real-time chat, personalized feeds,
          and smart notifications, we make finding the perfect team effortless.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-xl bg-gray-50 h-full transition-all duration-300 hover:bg-blue-50 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="mb-4 flex justify-center text-gray-900">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
