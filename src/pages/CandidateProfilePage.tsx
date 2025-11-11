import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Avatar,
  Stack,
  Chip,
  Divider,
  LinearProgress,
  Link as MuiLink,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Award, 
  Star, 
  Briefcase, 
  GraduationCap,
  Phone,
  Linkedin,
  Globe,
  FileText,
  Languages,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createInvitation } from '../services/invitationService';
import { getAllPosts } from '../data/mockData';

interface CandidateDetail {
  id: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  role: 'student' | 'faculty';
  headline: string;
  email: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  department: string;
  position?: string;
  year?: string;
  cgpa?: string;
  location: string;
  joinedDate: string;
  bio: string;
  skills: Array<{ name: string; level: number }>;
  experience: Array<{ 
    title: string; 
    organization: string; 
    duration: string; 
    description: string;
    location?: string;
    type?: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  }>;
  education: Array<{ 
    degree: string; 
    institution: string; 
    year: string; 
    grade?: string;
    location?: string;
    description?: string;
  }>;
  projects: Array<{ 
    title: string; 
    description: string; 
    technologies: string[];
    link?: string;
    duration?: string;
  }>;
  achievements: string[];
  certifications: Array<{ 
    name: string; 
    issuer: string; 
    date: string;
    credentialId?: string;
    link?: string;
  }>;
  languages: Array<{ name: string; proficiency: string }>;
}

const CandidateProfilePage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [invited, setInvited] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Get postId from location state (if navigated from RecommendedCandidatesPage)
  const postId = (location.state as any)?.postId;
  const post = postId ? getAllPosts(user).find(p => p.id === postId) : null;

  // Mock candidate data
  const getCandidateData = (id: string): CandidateDetail | null => {
    // Profile images
    const profileImages = {
      madhuri: 'file:///C:/Users/user/Downloads/PIC%203.jpg',
      annanya: 'file:///C:/Users/user/Downloads/PIC2.jpg',
      vedhakshi: 'file:///C:/Users/user/Downloads/PIC1.jpg',
      maaroof: 'file:///C:/Users/user/Documents/me%20in%20swag.jpg',
      krishna: 'file:///C:/Users/user/Documents/pic%20of%20me%20.jpg',
      satwika: 'file:///C:/Users/user/Documents/cute%20of%20me%20.jpg',
      chandrika: 'file:///C:/Users/user/Downloads/6293645.jpg',
    };
    
    const candidates: Record<string, CandidateDetail> = {
      'student-1': {
        id: 'student-1',
        name: 'Madhuri',
        avatar: profileImages.madhuri,
        coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'Machine Learning Enthusiast | AI Researcher | Python Developer',
        email: 'madhuri@university.edu',
        phone: '+91 98765 43210',
        linkedin: 'https://linkedin.com/in/madhuri',
        website: 'https://madhuri.dev',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: '8.9',
        location: 'Hyderabad, Telangana',
        joinedDate: 'August 2022',
        bio: 'Passionate computer science student with a strong focus on machine learning and artificial intelligence. Currently conducting research in deep learning optimization and neural network architectures. Experienced in developing ML models for real-world applications and eager to contribute to innovative projects that leverage AI to solve complex problems.',
        skills: [
          { name: 'Python', level: 95 },
          { name: 'Machine Learning', level: 90 },
          { name: 'TensorFlow', level: 85 },
          { name: 'PyTorch', level: 85 },
          { name: 'Data Analysis', level: 88 },
          { name: 'Deep Learning', level: 87 },
          { name: 'Computer Vision', level: 82 },
          { name: 'NLP', level: 80 },
          { name: 'Scikit-learn', level: 90 },
          { name: 'Pandas', level: 92 },
        ],
        experience: [
          {
            title: 'Machine Learning Research Intern',
            organization: 'AI Research Lab, University',
            duration: 'Jun 2024 - Present · 6 mos',
            location: 'On-site',
            type: 'Internship',
            description: 'Working on cutting-edge neural network optimization techniques and computer vision applications. Developed a novel architecture that improved image classification accuracy by 8%. Collaborating with PhD students on research papers for submission to ICML and NeurIPS conferences.',
          },
          {
            title: 'Teaching Assistant - Introduction to AI',
            organization: 'Computer Science Department',
            duration: 'Jan 2024 - May 2024 · 5 mos',
            location: 'On-site',
            type: 'Part-time',
            description: 'Assisted Professor in teaching Introduction to Artificial Intelligence course for 150+ students. Conducted weekly lab sessions, graded assignments, and provided one-on-one tutoring. Developed supplementary learning materials that improved student comprehension scores by 15%.',
          },
          {
            title: 'Software Development Intern',
            organization: 'TechStart Inc.',
            duration: 'Jun 2023 - Aug 2023 · 3 mos',
            location: 'Remote',
            type: 'Internship',
            description: 'Developed data analysis pipelines using Python and automated reporting systems. Created visualizations for business metrics using Matplotlib and Seaborn. Collaborated with cross-functional teams in an Agile environment.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in Computer Science',
            institution: 'University Name',
            year: '2022 - 2026',
            grade: 'CGPA: 8.9/10',
            location: 'California, USA',
            description: 'Relevant Coursework: Machine Learning, Deep Learning, Computer Vision, Natural Language Processing, Data Structures & Algorithms, Database Systems',
          },
          {
            degree: 'High School Diploma',
            institution: 'Springfield High School',
            year: '2018 - 2022',
            grade: 'GPA: 4.0/4.0',
            location: 'California, USA',
          },
        ],
        projects: [
          {
            title: 'Advanced Image Classification System',
            description: 'Developed a state-of-the-art CNN-based image classifier using ResNet architecture achieving 95% accuracy on CIFAR-100 dataset. Implemented data augmentation techniques and transfer learning to improve model performance.',
            technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy'],
            link: 'https://github.com/emilyjohnson/image-classifier',
            duration: 'Sep 2024 - Nov 2024',
          },
          {
            title: 'Sentiment Analysis Tool for Social Media',
            description: 'Built an NLP-based sentiment analyzer for analyzing customer reviews and social media posts. Achieved 92% accuracy using LSTM networks and BERT embeddings. Deployed as a REST API using Flask.',
            technologies: ['Python', 'NLTK', 'Scikit-learn', 'BERT', 'Flask'],
            link: 'https://github.com/emilyjohnson/sentiment-analyzer',
            duration: 'Jun 2024 - Aug 2024',
          },
          {
            title: 'Real-time Object Detection System',
            description: 'Implemented YOLO v8 for real-time object detection in video streams. Optimized for edge devices with 30+ FPS performance on Raspberry Pi.',
            technologies: ['Python', 'PyTorch', 'OpenCV', 'YOLO'],
            duration: 'Mar 2024 - May 2024',
          },
        ],
        achievements: [
          '🏆 1st Place - University AI Hackathon 2024 (out of 50+ teams)',
          '📜 Dean\'s List - 5 consecutive semesters',
          '📝 Research Paper Published in IEEE CVPR Conference 2024',
          '🥇 Gold Medal - National Science Olympiad',
          '💡 Innovation Award - Campus Startup Competition',
        ],
        certifications: [
          {
            name: 'Machine Learning Specialization',
            issuer: 'Stanford University (Coursera)',
            date: 'Nov 2023',
            credentialId: 'ABC123XYZ',
            link: 'https://coursera.org/verify/ABC123XYZ',
          },
          {
            name: 'Deep Learning Specialization',
            issuer: 'DeepLearning.AI',
            date: 'Aug 2023',
            credentialId: 'DL456789',
            link: 'https://coursera.org/verify/DL456789',
          },
          {
            name: 'TensorFlow Developer Certificate',
            issuer: 'Google',
            date: 'Jun 2023',
            credentialId: 'TF-CERT-2023',
          },
          {
            name: 'AWS Certified Cloud Practitioner',
            issuer: 'Amazon Web Services',
            date: 'Mar 2023',
            credentialId: 'AWS-CCP-2023',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Native' },
          { name: 'Spanish', proficiency: 'Professional Working Proficiency' },
          { name: 'French', proficiency: 'Elementary Proficiency' },
        ],
      },
      'student-2': {
        id: 'student-2',
        name: 'Annanya',
        avatar: profileImages.annanya,
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'Full-Stack Developer | MERN Stack | Open Source Contributor',
        email: 'annanya@university.edu',
        phone: '+91 98765 43211',
        linkedin: 'https://linkedin.com/in/annanya',
        website: 'https://annanya.io',
        department: 'Information Technology',
        year: '4th Year',
        cgpa: '9.2',
        location: 'Bengaluru, Karnataka',
        joinedDate: 'August 2021',
        bio: 'Full-stack developer passionate about building scalable web applications and contributing to open-source projects. Experienced in the MERN stack with a strong foundation in modern web technologies and cloud deployment.',
        skills: [
          { name: 'React', level: 98 },
          { name: 'Node.js', level: 95 },
          { name: 'JavaScript', level: 97 },
          { name: 'TypeScript', level: 92 },
          { name: 'MongoDB', level: 88 },
          { name: 'Express.js', level: 90 },
          { name: 'Next.js', level: 85 },
          { name: 'GraphQL', level: 80 },
          { name: 'Docker', level: 83 },
          { name: 'AWS', level: 78 },
        ],
        experience: [
          {
            title: 'Software Engineering Intern',
            organization: 'TechCorp Solutions',
            duration: 'May 2024 - Aug 2024 · 4 mos',
            location: 'New York, NY',
            type: 'Internship',
            description: 'Developed microservices using Node.js and deployed on AWS ECS. Built responsive UIs with React and implemented real-time features using WebSockets. Reduced API response time by 40% through optimization.',
          },
          {
            title: 'Frontend Developer',
            organization: 'Digital Agency LLC',
            duration: 'Jan 2024 - Apr 2024 · 4 mos',
            location: 'Remote',
            type: 'Contract',
            description: 'Created modern, responsive websites for clients using React and Next.js. Implemented SEO best practices and achieved 95+ Lighthouse scores. Collaborated with designers to deliver pixel-perfect implementations.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in Information Technology',
            institution: 'University Name',
            year: '2021 - 2025',
            grade: 'CGPA: 9.2/10',
            location: 'New York, USA',
            description: 'Focus on web technologies, software engineering, and cloud computing',
          },
        ],
        projects: [
          {
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration (Stripe), inventory management, and admin dashboard. Supports 1000+ concurrent users.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Redis'],
            link: 'https://github.com/michaelchen/ecommerce',
            duration: 'Jul 2024 - Present',
          },
          {
            title: 'Real-Time Collaboration Tool',
            description: 'Built a Google Docs-like collaborative editor with real-time synchronization using operational transformation.',
            technologies: ['React', 'Socket.io', 'Node.js', 'CRDTs'],
            link: 'https://github.com/michaelchen/collab-editor',
            duration: 'Mar 2024 - Jun 2024',
          },
        ],
        achievements: [
          '🌟 Google Summer of Code Participant 2024',
          '💻 Top Contributor - Popular Open Source Project (5000+ stars)',
          '🏅 Best Project Award - University Tech Fest',
          '📱 Published App with 10k+ downloads',
        ],
        certifications: [
          {
            name: 'AWS Certified Solutions Architect - Associate',
            issuer: 'Amazon Web Services',
            date: 'Sep 2024',
          },
          {
            name: 'Meta Front-End Developer Professional Certificate',
            issuer: 'Meta',
            date: 'Jun 2024',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Native' },
          { name: 'Mandarin', proficiency: 'Native' },
        ],
      },
      'student-3': {
        id: 'student-3',
        name: 'Vedhakshi',
        avatar: profileImages.vedhakshi,
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'UI/UX Designer | Frontend Developer | Design Systems Enthusiast',
        email: 'vedhakshi@university.edu',
        linkedin: 'https://linkedin.com/in/vedhakshi',
        department: 'Computer Science',
        year: '2nd Year',
        cgpa: '8.5',
        location: 'Chennai, Tamil Nadu',
        joinedDate: 'August 2023',
        bio: 'Creative UI/UX designer and frontend developer with a passion for creating beautiful, user-centric digital experiences. Skilled in design thinking, prototyping, and modern frontend frameworks.',
        skills: [
          { name: 'UI/UX Design', level: 95 },
          { name: 'Figma', level: 92 },
          { name: 'React', level: 85 },
          { name: 'JavaScript', level: 80 },
          { name: 'HTML/CSS', level: 90 },
          { name: 'Adobe XD', level: 88 },
          { name: 'Tailwind CSS', level: 87 },
          { name: 'Design Systems', level: 83 },
        ],
        experience: [
          {
            title: 'UI/UX Design Intern',
            organization: 'Creative Studio',
            duration: 'Jun 2024 - Aug 2024 · 3 mos',
            location: 'Austin, TX',
            type: 'Internship',
            description: 'Created wireframes, mockups, and interactive prototypes for mobile applications. Conducted user research and usability testing. Designed responsive interfaces following Material Design guidelines.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in Computer Science',
            institution: 'University Name',
            year: '2023 - 2027',
            grade: 'CGPA: 8.5/10',
            location: 'Texas, USA',
          },
        ],
        projects: [
          {
            title: 'Campus Events Mobile App',
            description: 'Designed and developed a mobile app for managing university events with 2000+ active users.',
            technologies: ['React Native', 'Firebase', 'Figma'],
            duration: 'Sep 2024 - Nov 2024',
          },
        ],
        achievements: [
          '🎨 Best Design Award - University Hackathon 2024',
          '💰 Design Scholarship Recipient',
          '🏆 Winner - UI/UX Design Competition',
        ],
        certifications: [
          {
            name: 'Google UX Design Professional Certificate',
            issuer: 'Google',
            date: 'Jul 2024',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Native' },
        ],
      },
      'faculty-1': {
        id: 'faculty-1',
        name: 'Dr. Maaroof',
        avatar: profileImages.maaroof,
        coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=300&fit=crop',
        role: 'faculty',
        headline: 'Associate Professor of Computer Science | AI/ML Researcher | Ph.D. Supervisor',
        email: 'maaroof@university.edu',
        phone: '+91 98765 43212',
        linkedin: 'https://linkedin.com/in/dr-maaroof',
        website: 'https://cs.university.edu/~maaroof',
        department: 'Computer Science',
        position: 'Associate Professor',
        location: 'Hyderabad, Telangana',
        joinedDate: 'January 2015',
        bio: 'Associate Professor specializing in machine learning, deep learning, and AI applications. Leading a research lab focused on neural network architectures and computer vision. Published 60+ papers in top-tier conferences and journals including NeurIPS, ICML, and CVPR. Passionate about mentoring students and advancing the field of artificial intelligence.',
        skills: [
          { name: 'Machine Learning', level: 99 },
          { name: 'Deep Learning', level: 98 },
          { name: 'Computer Vision', level: 97 },
          { name: 'Research Methodology', level: 99 },
          { name: 'Python', level: 95 },
          { name: 'TensorFlow', level: 93 },
          { name: 'PyTorch', level: 95 },
          { name: 'Academic Writing', level: 98 },
        ],
        experience: [
          {
            title: 'Associate Professor',
            organization: 'University Name',
            duration: '2019 - Present · 5 yrs',
            location: 'Stanford, CA',
            type: 'Full-time',
            description: 'Leading AI research lab with 12 PhD students and 8 Master\'s students. Teaching graduate courses in Machine Learning and Deep Learning. Secured $2.5M in research grants from NSF and industry partners. Published 35 papers during this period.',
          },
          {
            title: 'Assistant Professor',
            organization: 'University Name',
            duration: '2015 - 2019 · 4 yrs',
            location: 'Stanford, CA',
            type: 'Full-time',
            description: 'Established research program in neural architecture search and computer vision. Taught undergraduate and graduate courses. Published 25 papers and graduated 5 PhD students.',
          },
          {
            title: 'Postdoctoral Researcher',
            organization: 'MIT Computer Science and AI Laboratory',
            duration: '2014 - 2015 · 1 yr',
            location: 'Cambridge, MA',
            type: 'Full-time',
            description: 'Conducted research on deep learning optimization techniques. Collaborated with leading researchers in the field.',
          },
        ],
        education: [
          {
            degree: 'Ph.D. in Computer Science',
            institution: 'Stanford University',
            year: '2010 - 2014',
            description: 'Dissertation: "Novel Approaches to Neural Network Optimization"',
            location: 'Stanford, CA',
          },
          {
            degree: 'M.S. in Computer Science',
            institution: 'MIT',
            year: '2008 - 2010',
            grade: 'GPA: 4.0/4.0',
            location: 'Cambridge, MA',
          },
          {
            degree: 'B.S. in Computer Science',
            institution: 'UC Berkeley',
            year: '2004 - 2008',
            grade: 'Summa Cum Laude',
            location: 'Berkeley, CA',
          },
        ],
        projects: [
          {
            title: 'Neural Architecture Search Framework',
            description: 'Developed a novel automated neural architecture search algorithm that reduces search time by 60% compared to existing methods.',
            technologies: ['Python', 'TensorFlow', 'PyTorch', 'Ray'],
            duration: '2023 - Present',
          },
          {
            title: 'Advanced Object Detection System',
            description: 'Created state-of-the-art object detection model achieving 92% mAP on COCO dataset.',
            technologies: ['Python', 'PyTorch', 'CUDA'],
            duration: '2021 - 2023',
          },
        ],
        achievements: [
          '🏆 Best Paper Award - ICML 2023',
          '🎓 Excellence in Teaching Award - 2022, 2020, 2018',
          '📚 60+ Publications in Top-Tier Conferences (h-index: 35)',
          '💰 $2.5M Research Grants (NSF, DARPA, Google)',
          '👨‍🎓 Supervised 15 PhD students (10 graduated)',
          '🌟 Named Rising Star in AI - IEEE 2019',
        ],
        certifications: [
          {
            name: 'Senior Member, IEEE',
            issuer: 'IEEE',
            date: '2020',
          },
          {
            name: 'Associate Editor, IEEE Transactions on Neural Networks',
            issuer: 'IEEE',
            date: '2021',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Native' },
          { name: 'German', proficiency: 'Professional Working Proficiency' },
        ],
      },
      'faculty-2': {
        id: 'faculty-2',
        name: 'Prof. Krishna',
        avatar: profileImages.krishna,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=300&fit=crop',
        role: 'faculty',
        headline: 'Assistant Professor | Data Science Expert | Statistical Analysis Specialist',
        email: 'krishna@university.edu',
        linkedin: 'https://linkedin.com/in/prof-krishna',
        department: 'Information Systems',
        position: 'Assistant Professor',
        location: 'Mumbai, Maharashtra',
        joinedDate: 'August 2018',
        bio: 'Assistant Professor specializing in data science, statistical analysis, and business intelligence. Passionate about applying data-driven solutions to real-world problems and teaching the next generation of data scientists.',
        skills: [
          { name: 'Data Science', level: 97 },
          { name: 'Statistical Analysis', level: 96 },
          { name: 'Python', level: 93 },
          { name: 'R Programming', level: 95 },
          { name: 'SQL', level: 90 },
          { name: 'Machine Learning', level: 88 },
          { name: 'Business Intelligence', level: 92 },
        ],
        experience: [
          {
            title: 'Assistant Professor',
            organization: 'University Name',
            duration: '2018 - Present · 6 yrs',
            location: 'Boston, MA',
            type: 'Full-time',
            description: 'Teaching data science courses and conducting research on predictive analytics. Secured industry collaboration grants worth $500K. Published 35 papers in reputed journals.',
          },
        ],
        education: [
          {
            degree: 'Ph.D. in Information Systems',
            institution: 'Carnegie Mellon University',
            year: '2013 - 2017',
            location: 'Pittsburgh, PA',
          },
          {
            degree: 'M.S. in Statistics',
            institution: 'Stanford University',
            year: '2011 - 2013',
            location: 'Stanford, CA',
          },
        ],
        projects: [
          {
            title: 'Predictive Analytics Platform for Healthcare',
            description: 'Developed analytics platform for predicting patient readmissions with 87% accuracy.',
            technologies: ['Python', 'R', 'SQL', 'Tableau'],
            duration: '2022 - 2024',
          },
        ],
        achievements: [
          '🏆 Outstanding Research Award - 2023, 2021',
          '📝 40+ Publications in Top Journals',
          '💰 Industry Collaboration Grants - $500K',
          '🎓 Excellent Teacher Award - 2022',
        ],
        certifications: [
          {
            name: 'Certified Analytics Professional (CAP)',
            issuer: 'INFORMS',
            date: '2019',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Native' },
          { name: 'Swedish', proficiency: 'Limited Working Proficiency' },
        ],
      },
      'student-4': {
        id: 'student-4',
        name: 'Rahul Sharma',
        avatar: 'https://i.pravatar.cc/150?img=15',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'Backend Developer | Java Enthusiast | Cloud Computing Specialist',
        email: 'rahul.sharma@university.edu',
        phone: '+91 98765 11111',
        linkedin: 'https://linkedin.com/in/rahulsharma',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: '9.0',
        location: 'Bangalore, Karnataka',
        joinedDate: 'August 2022',
        bio: 'Backend developer passionate about building scalable microservices and cloud-native applications. Experienced in Java Spring Boot ecosystem and containerization technologies.',
        skills: [
          { name: 'Java', level: 92 },
          { name: 'Spring Boot', level: 88 },
          { name: 'MySQL', level: 85 },
          { name: 'Docker', level: 87 },
          { name: 'Kubernetes', level: 82 },
          { name: 'REST API', level: 90 },
          { name: 'Microservices', level: 85 },
        ],
        experience: [
          {
            title: 'Backend Development Intern',
            organization: 'CloudTech Solutions',
            duration: 'May 2024 - Aug 2024 · 4 mos',
            location: 'Bangalore, India',
            type: 'Internship',
            description: 'Developed microservices using Spring Boot and deployed them on AWS using Docker and Kubernetes. Optimized database queries resulting in 40% performance improvement.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in Computer Science',
            institution: 'University Name',
            year: '2022 - 2026',
            grade: 'CGPA: 9.0/10',
            location: 'Bangalore, India',
          },
        ],
        projects: [
          {
            title: 'E-commerce Microservices Platform',
            description: 'Built a scalable e-commerce platform using microservices architecture with Spring Boot, handling 10K+ concurrent users.',
            technologies: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'Kubernetes', 'Redis'],
            link: 'https://github.com/rahul/ecommerce-microservices',
            duration: 'Jun 2024 - Oct 2024',
          },
        ],
        achievements: [
          '🏆 Winner - National Java Coding Championship 2024',
          '📜 Dean\'s List - 4 semesters',
          '💡 Best Backend Project - University Tech Fest',
        ],
        certifications: [
          {
            name: 'Oracle Certified Java Programmer',
            issuer: 'Oracle',
            date: 'Sep 2023',
          },
          {
            name: 'AWS Certified Developer - Associate',
            issuer: 'Amazon Web Services',
            date: 'Jan 2024',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Professional Working Proficiency' },
          { name: 'Hindi', proficiency: 'Native' },
        ],
      },
      'student-5': {
        id: 'student-5',
        name: 'Priya Patel',
        avatar: 'https://i.pravatar.cc/150?img=26',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'Data Scientist | Analytics Expert | Python & R Developer',
        email: 'priya.patel@university.edu',
        phone: '+91 98765 22222',
        linkedin: 'https://linkedin.com/in/priyapatel',
        department: 'Data Science',
        year: '4th Year',
        cgpa: '9.3',
        location: 'Mumbai, Maharashtra',
        joinedDate: 'August 2021',
        bio: 'Data science enthusiast with expertise in statistical analysis, machine learning, and data visualization. Passionate about extracting insights from complex datasets and building predictive models.',
        skills: [
          { name: 'Python', level: 94 },
          { name: 'R', level: 91 },
          { name: 'Machine Learning', level: 89 },
          { name: 'Data Visualization', level: 92 },
          { name: 'SQL', level: 88 },
          { name: 'Tableau', level: 87 },
          { name: 'Statistical Analysis', level: 90 },
        ],
        experience: [
          {
            title: 'Data Science Intern',
            organization: 'Analytics Pro Inc.',
            duration: 'Jan 2024 - Jun 2024 · 6 mos',
            location: 'Mumbai, India',
            type: 'Internship',
            description: 'Developed predictive models for customer churn analysis achieving 85% accuracy. Created interactive dashboards using Tableau for executive reporting.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Science in Data Science',
            institution: 'University Name',
            year: '2021 - 2025',
            grade: 'CGPA: 9.3/10',
            location: 'Mumbai, India',
          },
        ],
        projects: [
          {
            title: 'Customer Segmentation System',
            description: 'Built a clustering-based customer segmentation system using K-means and hierarchical clustering, improving marketing ROI by 25%.',
            technologies: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib', 'Seaborn'],
            link: 'https://github.com/priya/customer-segmentation',
            duration: 'Aug 2024 - Nov 2024',
          },
        ],
        achievements: [
          '🏆 Best Data Science Project - University Annual Fest',
          '📜 Consistent Dean\'s List - All Semesters',
          '💡 Innovation Award - Women in Data Science Event',
        ],
        certifications: [
          {
            name: 'Google Data Analytics Professional Certificate',
            issuer: 'Google',
            date: 'Jun 2023',
          },
          {
            name: 'Tableau Desktop Specialist',
            issuer: 'Tableau',
            date: 'Mar 2024',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Professional Working Proficiency' },
          { name: 'Hindi', proficiency: 'Native' },
          { name: 'Gujarati', proficiency: 'Native' },
        ],
      },
      'student-6': {
        id: 'student-6',
        name: 'Arjun Mehta',
        avatar: 'https://i.pravatar.cc/150?img=18',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'Frontend Developer | React Specialist | UI/UX Enthusiast',
        email: 'arjun.mehta@university.edu',
        phone: '+91 98765 33333',
        department: 'Information Technology',
        year: '2nd Year',
        cgpa: '8.7',
        location: 'Delhi, India',
        joinedDate: 'August 2023',
        bio: 'Frontend developer focused on creating beautiful and responsive user interfaces. Skilled in modern web technologies with a keen eye for design.',
        skills: [
          { name: 'HTML', level: 95 },
          { name: 'CSS', level: 93 },
          { name: 'JavaScript', level: 90 },
          { name: 'React', level: 88 },
          { name: 'Tailwind CSS', level: 92 },
          { name: 'Responsive Design', level: 90 },
        ],
        experience: [
          {
            title: 'Frontend Development Intern',
            organization: 'WebCraft Studio',
            duration: 'Jun 2024 - Aug 2024 · 3 mos',
            location: 'Remote',
            type: 'Internship',
            description: 'Developed responsive web applications using React and Tailwind CSS. Improved website load time by 35% through code optimization.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in Information Technology',
            institution: 'University Name',
            year: '2023 - 2027',
            grade: 'CGPA: 8.7/10',
            location: 'Delhi, India',
          },
        ],
        projects: [
          {
            title: 'Portfolio Website Builder',
            description: 'Created a drag-and-drop portfolio builder for developers with real-time preview and export functionality.',
            technologies: ['React', 'Tailwind CSS', 'JavaScript', 'Firebase'],
            link: 'https://github.com/arjun/portfolio-builder',
            duration: 'Sep 2024 - Nov 2024',
          },
        ],
        achievements: [
          '🏆 Best UI Design - College Hackathon',
          '📜 Dean\'s List - 2 semesters',
        ],
        certifications: [
          {
            name: 'Meta Front-End Developer Certificate',
            issuer: 'Meta',
            date: 'Aug 2024',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Professional Working Proficiency' },
          { name: 'Hindi', proficiency: 'Native' },
        ],
      },
      'student-7': {
        id: 'student-7',
        name: 'Sneha Reddy',
        avatar: 'https://i.pravatar.cc/150?img=24',
        coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'Full Stack Developer | Django Expert | API Developer',
        email: 'sneha.reddy@university.edu',
        phone: '+91 98765 44444',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: '8.8',
        location: 'Hyderabad, Telangana',
        joinedDate: 'August 2022',
        bio: 'Full stack developer specializing in Python Django framework and REST API development. Passionate about building robust web applications.',
        skills: [
          { name: 'Python', level: 91 },
          { name: 'Django', level: 89 },
          { name: 'PostgreSQL', level: 86 },
          { name: 'REST API', level: 90 },
          { name: 'Git', level: 88 },
          { name: 'JavaScript', level: 82 },
        ],
        experience: [
          {
            title: 'Python Developer Intern',
            organization: 'DevSolutions Ltd.',
            duration: 'May 2024 - Jul 2024 · 3 mos',
            location: 'Hyderabad, India',
            type: 'Internship',
            description: 'Developed RESTful APIs using Django REST Framework. Implemented authentication and authorization systems for multi-tenant applications.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in Computer Science',
            institution: 'University Name',
            year: '2022 - 2026',
            grade: 'CGPA: 8.8/10',
            location: 'Hyderabad, India',
          },
        ],
        projects: [
          {
            title: 'Task Management System',
            description: 'Built a comprehensive task management application with real-time notifications and team collaboration features.',
            technologies: ['Django', 'PostgreSQL', 'React', 'WebSockets'],
            link: 'https://github.com/sneha/task-manager',
            duration: 'Jul 2024 - Oct 2024',
          },
        ],
        achievements: [
          '🏆 2nd Place - State Level Coding Competition',
          '📜 Dean\'s List - 3 semesters',
        ],
        certifications: [
          {
            name: 'Python for Everybody Specialization',
            issuer: 'University of Michigan (Coursera)',
            date: 'May 2023',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Professional Working Proficiency' },
          { name: 'Telugu', proficiency: 'Native' },
          { name: 'Hindi', proficiency: 'Professional Working Proficiency' },
        ],
      },
      'student-8': {
        id: 'student-8',
        name: 'Karthik Kumar',
        avatar: 'https://i.pravatar.cc/150?img=13',
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'AI/ML Researcher | Deep Learning Expert | NLP Specialist',
        email: 'karthik.kumar@university.edu',
        phone: '+91 98765 55555',
        linkedin: 'https://linkedin.com/in/karthikkumar',
        department: 'AI & ML',
        year: '4th Year',
        cgpa: '9.1',
        location: 'Chennai, Tamil Nadu',
        joinedDate: 'August 2021',
        bio: 'AI/ML researcher with focus on deep learning and natural language processing. Published research in computer vision and worked on state-of-the-art NLP models.',
        skills: [
          { name: 'Python', level: 95 },
          { name: 'TensorFlow', level: 92 },
          { name: 'PyTorch', level: 93 },
          { name: 'Deep Learning', level: 91 },
          { name: 'NLP', level: 90 },
          { name: 'Computer Vision', level: 88 },
        ],
        experience: [
          {
            title: 'AI Research Intern',
            organization: 'AI Labs India',
            duration: 'Dec 2023 - Jun 2024 · 7 mos',
            location: 'Chennai, India',
            type: 'Internship',
            description: 'Worked on transformer-based models for text classification. Improved model accuracy by 12% through novel attention mechanisms.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in AI & ML',
            institution: 'University Name',
            year: '2021 - 2025',
            grade: 'CGPA: 9.1/10',
            location: 'Chennai, India',
          },
        ],
        projects: [
          {
            title: 'Multi-lingual Sentiment Analyzer',
            description: 'Developed a transformer-based sentiment analysis system supporting 10+ Indian languages with 88% accuracy.',
            technologies: ['PyTorch', 'Transformers', 'BERT', 'Python'],
            link: 'https://github.com/karthik/multilingual-sentiment',
            duration: 'Mar 2024 - Aug 2024',
          },
        ],
        achievements: [
          '🏆 Best Research Paper - National AI Conference 2024',
          '📜 Dean\'s List - All Semesters',
          '💡 Innovation Award - AI Hackathon',
        ],
        certifications: [
          {
            name: 'Deep Learning Specialization',
            issuer: 'DeepLearning.AI',
            date: 'Nov 2022',
          },
          {
            name: 'Natural Language Processing Specialization',
            issuer: 'DeepLearning.AI',
            date: 'Mar 2023',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Professional Working Proficiency' },
          { name: 'Tamil', proficiency: 'Native' },
          { name: 'Hindi', proficiency: 'Professional Working Proficiency' },
        ],
      },
      'student-9': {
        id: 'student-9',
        name: 'Ananya Singh',
        avatar: 'https://i.pravatar.cc/150?img=28',
        coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'Mobile App Developer | React Native & Flutter Expert',
        email: 'ananya.singh@university.edu',
        phone: '+91 98765 66666',
        department: 'Computer Science',
        year: '3rd Year',
        cgpa: '8.6',
        location: 'Pune, Maharashtra',
        joinedDate: 'August 2022',
        bio: 'Mobile application developer skilled in building cross-platform apps using React Native and Flutter. Passionate about creating smooth user experiences.',
        skills: [
          { name: 'React Native', level: 90 },
          { name: 'Flutter', level: 88 },
          { name: 'Firebase', level: 85 },
          { name: 'Mobile Development', level: 92 },
          { name: 'JavaScript', level: 87 },
          { name: 'Dart', level: 86 },
        ],
        experience: [
          {
            title: 'Mobile Developer Intern',
            organization: 'AppCraft Solutions',
            duration: 'Jun 2024 - Sep 2024 · 4 mos',
            location: 'Pune, India',
            type: 'Internship',
            description: 'Developed e-commerce mobile app using React Native serving 5000+ active users. Integrated payment gateways and push notifications.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in Computer Science',
            institution: 'University Name',
            year: '2022 - 2026',
            grade: 'CGPA: 8.6/10',
            location: 'Pune, India',
          },
        ],
        projects: [
          {
            title: 'Fitness Tracking App',
            description: 'Built a comprehensive fitness tracking application with workout plans, nutrition tracking, and social features.',
            technologies: ['Flutter', 'Firebase', 'Dart', 'Google Fit API'],
            link: 'https://github.com/ananya/fitness-tracker',
            duration: 'Aug 2024 - Nov 2024',
          },
        ],
        achievements: [
          '🏆 Best Mobile App - University Tech Fest',
          '📜 Dean\'s List - 3 semesters',
        ],
        certifications: [
          {
            name: 'Meta React Native Specialization',
            issuer: 'Meta',
            date: 'Jul 2024',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Professional Working Proficiency' },
          { name: 'Hindi', proficiency: 'Native' },
        ],
      },
      'student-10': {
        id: 'student-10',
        name: 'Vivek Joshi',
        avatar: 'https://i.pravatar.cc/150?img=11',
        coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=300&fit=crop',
        role: 'student',
        headline: 'Competitive Programmer | Algorithm Expert | C++ Developer',
        email: 'vivek.joshi@university.edu',
        phone: '+91 98765 77777',
        department: 'Information Technology',
        year: '2nd Year',
        cgpa: '8.4',
        location: 'Jaipur, Rajasthan',
        joinedDate: 'August 2023',
        bio: 'Competitive programming enthusiast with strong problem-solving skills. Active participant in coding competitions and passionate about algorithms.',
        skills: [
          { name: 'C++', level: 93 },
          { name: 'Python', level: 86 },
          { name: 'Algorithms', level: 92 },
          { name: 'Data Structures', level: 91 },
          { name: 'Competitive Programming', level: 94 },
          { name: 'Problem Solving', level: 95 },
        ],
        experience: [
          {
            title: 'Coding Tutor',
            organization: 'CodeMaster Academy',
            duration: 'Jan 2024 - Present · 11 mos',
            location: 'Remote',
            type: 'Part-time',
            description: 'Teaching data structures and algorithms to 50+ students. Preparing students for competitive programming contests.',
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology in Information Technology',
            institution: 'University Name',
            year: '2023 - 2027',
            grade: 'CGPA: 8.4/10',
            location: 'Jaipur, India',
          },
        ],
        projects: [
          {
            title: 'Algorithm Visualizer',
            description: 'Created an interactive web application to visualize sorting and graph algorithms for educational purposes.',
            technologies: ['C++', 'Python', 'JavaScript', 'D3.js'],
            link: 'https://github.com/vivek/algo-visualizer',
            duration: 'Sep 2024 - Nov 2024',
          },
        ],
        achievements: [
          '🏆 Gold Medal - ICPC Regional Round',
          '🥇 Rank 150 - Google Kickstart',
          '🏅 5 Star Coder - CodeChef',
          '📜 Dean\'s List - 2 semesters',
        ],
        certifications: [
          {
            name: 'Data Structures and Algorithms Specialization',
            issuer: 'UC San Diego (Coursera)',
            date: 'Jun 2024',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Professional Working Proficiency' },
          { name: 'Hindi', proficiency: 'Native' },
        ],
      },
      'faculty-3': {
        id: 'faculty-3',
        name: 'Dr. Rajesh Kumar',
        avatar: 'https://i.pravatar.cc/150?img=51',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=300&fit=crop',
        role: 'faculty',
        headline: 'Professor | Cloud Computing Expert | DevOps Specialist',
        email: 'rajesh.kumar@university.edu',
        phone: '+91 98765 88888',
        linkedin: 'https://linkedin.com/in/dr-rajesh-kumar',
        department: 'Computer Science',
        position: 'Professor',
        location: 'Bangalore, Karnataka',
        joinedDate: 'January 2010',
        bio: 'Professor specializing in cloud computing, DevOps, and distributed systems. Published 80+ research papers and led multiple industry-academia collaboration projects.',
        skills: [
          { name: 'Cloud Computing', level: 97 },
          { name: 'AWS', level: 95 },
          { name: 'Azure', level: 93 },
          { name: 'DevOps', level: 94 },
          { name: 'Microservices', level: 92 },
          { name: 'Kubernetes', level: 91 },
        ],
        experience: [
          {
            title: 'Professor',
            organization: 'University Name',
            duration: '2010 - Present · 14 yrs',
            location: 'Bangalore, India',
            type: 'Full-time',
            description: 'Teaching cloud computing and distributed systems. Leading research in cloud-native architectures. Supervised 20+ PhD students.',
          },
        ],
        education: [
          {
            degree: 'Ph.D. in Computer Science',
            institution: 'IIT Delhi',
            year: '2006 - 2010',
            location: 'Delhi, India',
          },
        ],
        projects: [
          {
            title: 'Enterprise Cloud Migration Framework',
            description: 'Developed a framework for seamless cloud migration of legacy enterprise applications.',
            technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
            duration: '2022 - 2024',
          },
        ],
        achievements: [
          '🏆 Best Faculty Award - 2023, 2019',
          '📚 80+ Publications in Top-Tier Conferences',
          '💰 $3M Research Grants',
          '🎓 Supervised 20+ PhD Students',
        ],
        certifications: [
          {
            name: 'AWS Certified Solutions Architect - Professional',
            issuer: 'Amazon Web Services',
            date: '2021',
          },
          {
            name: 'Microsoft Certified: Azure Solutions Architect Expert',
            issuer: 'Microsoft',
            date: '2020',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Native' },
          { name: 'Hindi', proficiency: 'Native' },
        ],
      },
      'faculty-4': {
        id: 'faculty-4',
        name: 'Dr. Meera Iyer',
        avatar: 'https://i.pravatar.cc/150?img=47',
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=300&fit=crop',
        role: 'faculty',
        headline: 'Associate Professor | Big Data Expert | Analytics Specialist',
        email: 'meera.iyer@university.edu',
        phone: '+91 98765 99999',
        linkedin: 'https://linkedin.com/in/dr-meera-iyer',
        department: 'Data Science',
        position: 'Associate Professor',
        location: 'Chennai, Tamil Nadu',
        joinedDate: 'July 2015',
        bio: 'Associate Professor with expertise in big data technologies and analytics. Passionate about teaching data science and conducting research in scalable data processing.',
        skills: [
          { name: 'Big Data', level: 96 },
          { name: 'Hadoop', level: 94 },
          { name: 'Spark', level: 95 },
          { name: 'Data Analytics', level: 93 },
          { name: 'Python', level: 91 },
          { name: 'SQL', level: 90 },
        ],
        experience: [
          {
            title: 'Associate Professor',
            organization: 'University Name',
            duration: '2015 - Present · 9 yrs',
            location: 'Chennai, India',
            type: 'Full-time',
            description: 'Teaching big data technologies and analytics. Published 50+ research papers. Led industry collaboration projects worth $1.5M.',
          },
        ],
        education: [
          {
            degree: 'Ph.D. in Data Science',
            institution: 'IISc Bangalore',
            year: '2011 - 2015',
            location: 'Bangalore, India',
          },
        ],
        projects: [
          {
            title: 'Real-time Data Processing Platform',
            description: 'Built a real-time data processing platform handling 1TB+ daily data using Spark and Kafka.',
            technologies: ['Spark', 'Hadoop', 'Kafka', 'Python'],
            duration: '2021 - 2023',
          },
        ],
        achievements: [
          '🏆 Excellence in Research Award - 2022',
          '📚 50+ Publications',
          '💰 Industry Grants - $1.5M',
          '🎓 Outstanding Teacher Award - 2020',
        ],
        certifications: [
          {
            name: 'Cloudera Certified Professional: Data Engineer',
            issuer: 'Cloudera',
            date: '2019',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Native' },
          { name: 'Tamil', proficiency: 'Native' },
        ],
      },
      'faculty-5': {
        id: 'faculty-5',
        name: 'Prof. Amit Verma',
        avatar: 'https://i.pravatar.cc/150?img=56',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=300&fit=crop',
        role: 'faculty',
        headline: 'Assistant Professor | Full Stack Developer | Web Technologies Expert',
        email: 'amit.verma@university.edu',
        phone: '+91 98765 00000',
        linkedin: 'https://linkedin.com/in/prof-amit-verma',
        department: 'Information Technology',
        position: 'Assistant Professor',
        location: 'Noida, Uttar Pradesh',
        joinedDate: 'August 2019',
        bio: 'Assistant Professor specializing in web development and full stack technologies. Industry expert with 5 years of experience before academia.',
        skills: [
          { name: 'Web Development', level: 94 },
          { name: 'JavaScript', level: 93 },
          { name: 'React', level: 92 },
          { name: 'Node.js', level: 91 },
          { name: 'Full Stack', level: 95 },
          { name: 'MongoDB', level: 88 },
        ],
        experience: [
          {
            title: 'Assistant Professor',
            organization: 'University Name',
            duration: '2019 - Present · 5 yrs',
            location: 'Noida, India',
            type: 'Full-time',
            description: 'Teaching web development courses. Mentoring students on full stack projects. Published 25+ research papers in web technologies.',
          },
          {
            title: 'Senior Full Stack Developer',
            organization: 'Tech Innovations Inc.',
            duration: '2014 - 2019 · 5 yrs',
            location: 'Bangalore, India',
            type: 'Full-time',
            description: 'Led development of enterprise web applications using MERN stack. Managed team of 8 developers.',
          },
        ],
        education: [
          {
            degree: 'Ph.D. in Computer Science',
            institution: 'IIIT Hyderabad',
            year: '2016 - 2019',
            location: 'Hyderabad, India',
          },
        ],
        projects: [
          {
            title: 'E-Learning Platform',
            description: 'Developed a comprehensive e-learning platform serving 10,000+ students with real-time video streaming.',
            technologies: ['React', 'Node.js', 'MongoDB', 'WebRTC'],
            duration: '2020 - 2022',
          },
        ],
        achievements: [
          '🏆 Best Teacher Award - 2023',
          '📚 25+ Publications',
          '💡 Industry Collaboration - Multiple Projects',
        ],
        certifications: [
          {
            name: 'MongoDB Certified Developer',
            issuer: 'MongoDB',
            date: '2018',
          },
        ],
        languages: [
          { name: 'English', proficiency: 'Professional Working Proficiency' },
          { name: 'Hindi', proficiency: 'Native' },
        ],
      },
    };

    return candidates[id] || null;
  };

  const candidate = getCandidateData(candidateId || '');

  // Set document title with candidate name
  useEffect(() => {
    if (candidate) {
      document.title = `${candidate.name} - Profile | United`;
    }
    return () => {
      document.title = 'United';
    };
  }, [candidate]);

  const handleInvite = async () => {
    if (!user?.id || !candidate || !post) return;

    try {
      createInvitation(post.id, user.id, candidate.id);

      setInvited(true);
      setSnackbarMessage(`Invitation sent to ${candidate.name}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sending invitation:', error);
      setSnackbarMessage('Failed to send invitation');
      setSnackbarOpen(true);
    }
  };

  if (!candidate) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Candidate not found</Typography>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowLeft />} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F3F2EF' }}>
      {/* Cover Image */}
      <Box
        sx={{
          height: 200,
          backgroundImage: `url(${candidate.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'white' },
          }}
        >
          Back
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, pb: 4 }}>
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 3, borderRadius: 2, mb: 2, overflow: 'visible', position: 'relative' }}>
            <Stack direction="row" spacing={3} sx={{ position: 'relative', overflow: 'visible' }}>
              <Avatar
                src={candidate.avatar}
                sx={{
                  width: 152,
                  height: 152,
                  border: '4px solid white',
                  mt: -10,
                }}
              >
                {candidate.name.charAt(0)}
              </Avatar>

              <Box sx={{ flex: 1, pt: 1, position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 0.5,
                    color: '#111827',
                    display: 'block',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {candidate.name}
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', mb: 2, fontWeight: 400 }}>
                  {candidate.headline}
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <MapPin size={16} color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      {candidate.location}
                    </Typography>
                  </Stack>
                  
                  {candidate.role === 'student' && candidate.cgpa && (
                    <>
                      <Typography variant="body2" color="text.secondary">•</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Star size={16} color="#F59E0B" />
                        <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                          CGPA: {candidate.cgpa}/10
                        </Typography>
                      </Stack>
                    </>
                  )}
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  {candidate.email && (
                    <Chip
                      icon={<Mail size={14} />}
                      label={candidate.email}
                      size="small"
                      clickable
                      component="a"
                      href={`mailto:${candidate.email}`}
                      sx={{ backgroundColor: '#E7F3FF' }}
                    />
                  )}
                  {candidate.phone && (
                    <Chip
                      icon={<Phone size={14} />}
                      label={candidate.phone}
                      size="small"
                      sx={{ backgroundColor: '#FFF4E6' }}
                    />
                  )}
                  {candidate.linkedin && (
                    <Chip
                      icon={<Linkedin size={14} />}
                      label="LinkedIn"
                      size="small"
                      clickable
                      component="a"
                      href={candidate.linkedin}
                      target="_blank"
                      sx={{ backgroundColor: '#0077B5', color: 'white' }}
                    />
                  )}
                  {candidate.website && (
                    <Chip
                      icon={<Globe size={14} />}
                      label="Website"
                      size="small"
                      clickable
                      component="a"
                      href={candidate.website}
                      target="_blank"
                      sx={{ backgroundColor: '#10B981', color: 'white' }}
                    />
                  )}
                </Stack>

                {/* Invite Button - Show only if navigated from a post */}
                {post && user?.id === post.author.id && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<UserCheck />}
                      onClick={handleInvite}
                      disabled={invited}
                      sx={{
                        backgroundColor: invited ? '#10B981' : '#6C47FF',
                        '&:hover': {
                          backgroundColor: invited ? '#10B981' : '#5936E0',
                        },
                        textTransform: 'none',
                        px: 3,
                      }}
                    >
                      {invited ? 'Invitation Sent' : 'Invite to Post'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Stack>
          </Paper>
        </motion.div>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          {/* Left Column */}
          <Box sx={{ flex: '0 0 68%' }}>
            {/* About */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                About
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {candidate.bio}
              </Typography>
            </Paper>

            {/* Experience */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <Briefcase size={24} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Experience
                </Typography>
              </Stack>

              <Stack spacing={3}>
                {candidate.experience.map((exp, index) => (
                  <Box key={index}>
                    <Stack direction="row" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: '#E7F3FF',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Briefcase size={24} color="#0A66C2" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {exp.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          {exp.organization} · {exp.type || 'Full-time'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem', mb: 0.5 }}>
                          {exp.duration}
                        </Typography>
                        {exp.location && (
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem', mb: 1 }}>
                            <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                            {exp.location}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ color: '#444', mt: 1, lineHeight: 1.6 }}>
                          {exp.description}
                        </Typography>
                      </Box>
                    </Stack>
                    {index < candidate.experience.length - 1 && <Divider sx={{ mt: 3 }} />}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Education */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <GraduationCap size={24} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Education
                </Typography>
              </Stack>

              <Stack spacing={3}>
                {candidate.education.map((edu, index) => (
                  <Box key={index}>
                    <Stack direction="row" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: '#FFF4E6',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <GraduationCap size={24} color="#F59E0B" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {edu.institution}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          {edu.degree}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem', mb: 0.5 }}>
                          {edu.year}
                        </Typography>
                        {edu.grade && (
                          <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600, mb: 0.5 }}>
                            {edu.grade}
                          </Typography>
                        )}
                        {edu.location && (
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem', mb: 1 }}>
                            <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                            {edu.location}
                          </Typography>
                        )}
                        {edu.description && (
                          <Typography variant="body2" sx={{ color: '#444', mt: 1 }}>
                            {edu.description}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    {index < candidate.education.length - 1 && <Divider sx={{ mt: 3 }} />}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Projects */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <FileText size={24} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Projects
                </Typography>
              </Stack>

              <Stack spacing={3}>
                {candidate.projects.map((project, index) => (
                  <Box key={index}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {project.title}
                      {project.link && (
                        <MuiLink href={project.link} target="_blank" sx={{ ml: 1, fontSize: '0.875rem' }}>
                          <Globe size={14} style={{ display: 'inline', marginBottom: -2 }} />
                        </MuiLink>
                      )}
                    </Typography>
                    {project.duration && (
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem', mb: 1 }}>
                        {project.duration}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: '#444', mb: 1.5, lineHeight: 1.6 }}>
                      {project.description}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                      {project.technologies.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: '#F3F4F6',
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      ))}
                    </Stack>
                    {index < candidate.projects.length - 1 && <Divider sx={{ mt: 3 }} />}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Certifications */}
            {candidate.certifications.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                  <Award size={24} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Licenses & Certifications
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  {candidate.certifications.map((cert, index) => (
                    <Box key={index}>
                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: '#F0FDF4',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Award size={24} color="#10B981" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {cert.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                            {cert.issuer}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                            Issued {cert.date}
                          </Typography>
                          {cert.credentialId && (
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                              Credential ID: {cert.credentialId}
                            </Typography>
                          )}
                          {cert.link && (
                            <MuiLink href={cert.link} target="_blank" sx={{ fontSize: '0.875rem', mt: 0.5, display: 'inline-block' }}>
                              Show credential →
                            </MuiLink>
                          )}
                        </Box>
                      </Stack>
                      {index < candidate.certifications.length - 1 && <Divider sx={{ mt: 3 }} />}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: '0 0 30%' }}>
            {/* Skills */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Star size={20} color="#6C47FF" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Skills
                </Typography>
              </Stack>

              <Stack spacing={2}>
                {candidate.skills.map((skill) => (
                  <Box key={skill.name}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {skill.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {skill.level}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={skill.level}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#E5E7EB',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#6C47FF',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Languages */}
            {candidate.languages.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Languages size={20} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Languages
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  {candidate.languages.map((lang, index) => (
                    <Box key={index}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {lang.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {lang.proficiency}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Achievements */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Award size={20} color="#6C47FF" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Achievements
                </Typography>
              </Stack>

              <Stack spacing={1.5}>
                {candidate.achievements.map((achievement, index) => (
                  <Typography key={index} variant="body2" sx={{ color: '#444', lineHeight: 1.6 }}>
                    {achievement}
                  </Typography>
                ))}
              </Stack>
            </Paper>

            {/* Additional Info */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#666', mb: 2 }}>
                Additional Information
              </Typography>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                    Department
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {candidate.department}
                  </Typography>
                </Box>

                {candidate.role === 'student' && candidate.year && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                      Year
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {candidate.year}
                    </Typography>
                  </Box>
                )}

                {candidate.position && (
                  <Box>
                    <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                      Position
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {candidate.position}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                    Member Since
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {candidate.joinedDate}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CandidateProfilePage;
