import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ExifReader from 'exifreader';

const PROFILE = {
  name: "Nikolaos Fanourakis",
  title: "Data Scientist, PhD",
  location: "Heraklion, Crete, Greece",
  email: "nfanourakis@sataliadata.com",
  github: "https://github.com/nikolaosfanourakis",
  linkedin: "https://linkedin.com/in/nikolaosfanourakis",
  cv: "/Fanourakis_CV.pdf",
  shortBio:
    "Data Scientist with a PhD in Computer Science specializing in machine learning, knowledge graphs, embeddings and entity alignment. Currently working at SATALIA, developing innovative AI solutions for real-world challenges. Passionate about research, ML, and software engineering.",
};

const PLACEHOLDERS = {
  experience: [
    { role: "Data Scientist", org: "SATALIA", period: "2025 — Present", desc: "Developing machine learning solutions and AI applications for data-driven insights. Working on computer vision, predictive modeling, and advanced analytics projects." },
    { role: "PhD Researcher", org: "Technical University of Crete", period: "2018 — 2024", desc: "Conducted advanced research in computer science with focus on machine learning, computer vision, and biomedical applications. Published research in peer-reviewed journals and conferences." },
    { role: "Research Assistant", org: "Various Research Projects", period: "2016 — 2018", desc: "Contributed to multiple research initiatives in machine learning and data analysis, developing expertise in algorithm implementation and experimental design." },
  ],
  education: [
    { degree: "Ph.D. in Computer Science", inst: "Technical University of Crete", period: "2018 — 2024" },
    { degree: "M.Sc. in Computer Science", inst: "Technical University of Crete", period: "2016 — 2018" },
    { degree: "B.Sc. in Applied Mathematics", inst: "University of Crete", period: "2012 — 2016" },
  ],
  projects: [
    { title: "Computer Vision for Biomedical Applications", desc: "Developed advanced machine learning models for medical image analysis and diagnostic support systems during PhD research." },
    { title: "Machine Learning Pipeline at SATaALIA", desc: "Built end-to-end ML solutions for data analytics and predictive modeling, implementing scalable algorithms for business intelligence." },
    { title: "Research Publications & Open Source", desc: "Contributed to academic research with published papers in computer science conferences and journals, sharing methodologies and findings." },
    { title: "Data Science Consulting", desc: "Applied statistical analysis and machine learning techniques to solve real-world problems across various domains and industries." },
  ],
  publications: [
    { title: "Machine Learning Approaches for Biomedical Image Analysis", venue: "Computer Vision Conference", year: "2023", link: "#" },
    { title: "Advanced Algorithms for Medical Diagnostic Systems", venue: "Journal of Biomedical Computing", year: "2022", link: "#" },
    { title: "Deep Learning Applications in Healthcare", venue: "International AI Conference", year: "2021", link: "#" },
    { title: "Statistical Methods for Complex Data Analysis", venue: "Applied Mathematics Journal", year: "2020", link: "#" },
  ],
  presentations: [
    { title: "AI Solutions for Business Intelligence", event: "SATaALIA Tech Talk", date: "September 2024", location: "Heraklion, Greece", link: "#" },
    { title: "PhD Defense: Computer Vision Applications", event: "Technical University of Crete", date: "June 2024", location: "Chania, Greece", link: "#" },
    { title: "Machine Learning for Medical Applications", event: "Greek Computer Science Conference", date: "October 2023", location: "Athens, Greece", link: "#" },
    { title: "Research Methodologies in AI", event: "Graduate Student Symposium", date: "May 2022", location: "Technical University of Crete", link: "#" },
  ],
  certifications: [
    { title: "PhD in Computer Science", issuer: "Technical University of Crete", date: "2024", expiry: "Never", link: "#", badge: "�" },
    { title: "Python for Data Science Specialization", issuer: "Coursera", date: "2023", expiry: "Never", link: "#", badge: "🐍" },
    { title: "Machine Learning Certification", issuer: "Stanford Online", date: "2022", expiry: "Never", link: "#", badge: "🤖" },
    { title: "Deep Learning Specialization", issuer: "deeplearning.ai", date: "2021", expiry: "Never", link: "#", badge: "🧠" },
  ],
  photos: [
    { id: 1, src: `/photos/DSC_0085.jpg`, caption: `Graffiti Building`, equipment: null, category: "street" },
    { id: 2, src: `/photos/DSC_0102.jpg`, caption: `Stubbles`, equipment: null, category: "nature" },
    { id: 3, src: `/photos/DSC_0114.jpg`, caption: `Skateboard Platform`, equipment: null, category: "street" },
  ],
};

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;
    const apply = (t) => {
      if (t === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    };
    apply(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme];
}

function useScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(`#`, "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [hash]);
}

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
      }
    );

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);
}

function Lightbox({ src, caption, equipment, onClose, onNext, onPrev, hasNext, hasPrev }) {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4" onClick={onClose}>
      <div className="flex flex-col items-center max-w-[95vw] max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <div className="group relative">
          <img 
            src={src} 
            alt={caption} 
            className="max-w-full max-h-[85vh] w-auto h-auto rounded shadow-lg mb-4 object-contain" 
          />
          
          {/* Previous Button */}
          {hasPrev && (
            <button 
              onClick={onPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-all duration-200 opacity-0 group-hover:opacity-100 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
              title="Previous photo"
            >
              ‹
            </button>
          )}
          
          {/* Next Button */}
          {hasNext && (
            <button 
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-all duration-200 opacity-0 group-hover:opacity-100 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
              title="Next photo"
            >
              ›
            </button>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-white text-lg font-medium mb-2">{caption}</p>
          {equipment && (
            <p className="text-gray-300 text-sm">
              <span className="inline-flex items-center gap-1">
                <span>📷</span>
                {equipment}
              </span>
            </p>
          )}
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors"
        title="Close"
      >
        ✕
      </button>
    </div>
  );
}

function Container({ children }) {
  return <div className="mx-auto max-w-4xl px-6 sm:px-8">{children}</div>;
}

function Header({ theme, setTheme }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#about", label: "About", id: "about" },
    { href: "#work", label: "Experience", id: "work" },
    { href: "#education", label: "Education", id: "education" },
    { href: "#projects", label: "Projects", id: "projects" },
    { href: "#publications", label: "Publications", id: "publications" },
    { href: "#presentations", label: "Presentations", id: "presentations" },
    { href: "#certifications", label: "Certifications", id: "certifications" },
  ];

  return (
    <header className="py-6 sticky top-0 z-40 glass-effect backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <Link to="/" className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">{PROFILE.name}</Link>
            <span className="text-sm text-slate-500 dark:text-slate-400"></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 text-sm">
            {navItems.map(item => (
              <Link 
                key={item.id}
                to={location.pathname === '/photos' ? `/${item.href}` : item.href}
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200 hover:underline focus:outline-none focus:text-slate-800 dark:focus:text-slate-200"
              >
                {item.label}
              </Link>
            ))}
            <Link 
              to="/photos" 
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200 hover:underline focus:outline-none focus:text-slate-800 dark:focus:text-slate-200"
            >
              Photography
            </Link>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-3 pt-4">
              {navItems.map(item => (
                <Link 
                  key={item.id}
                  to={location.pathname === '/photos' ? `/${item.href}` : item.href}
                  className="block py-2 px-2 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                to="/photos" 
                className="block py-2 px-2 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Photography
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function ThemeToggle({ theme, setTheme }) {
  const next = theme === "light" ? "dark" : "light";
  return (
    <button
      onClick={() => setTheme(next)}
      className="ml-3 px-3 py-2 border rounded-full text-sm bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all duration-300 transform hover:scale-110"
      title={`Theme: ${theme} — click to switch to ${next}`}>
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

function Hero() {
  return (
    <section id="about" className="py-6">
      <div className="rounded-xl p-6 md:p-8 glass-effect shadow-lg border max-w-4xl mx-auto scroll-animate relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-500 dark:bg-slate-400"></div>
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 text-xs font-medium bg-slate-100/80 dark:bg-slate-800/80 rounded-full text-slate-600 dark:text-slate-400 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          Open to exciting projects
        </div>
        
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
          {PROFILE.name}
        </h1>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">📍</span>
          <p className="text-base text-slate-700 dark:text-slate-300 font-medium">{PROFILE.title} — {PROFILE.location}</p>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm max-w-3xl mb-4">
          {PROFILE.shortBio}
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a 
              href={`mailto:${PROFILE.email}`} 
              className="group flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 text-xs font-medium"
            >
              <span className="text-xs group-hover:scale-110 transition-transform">✉️</span>
              Email
            </a>
            <a 
              href={PROFILE.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 text-xs font-medium"
            >
              <span className="text-xs group-hover:scale-110 transition-transform">💻</span>
              GitHub
            </a>
            <a 
              href={PROFILE.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 text-xs font-medium"
            >
              <span className="text-xs group-hover:scale-110 transition-transform">🔗</span>
              LinkedIn
            </a>
          </div>
          
          {/* CV Download Button */}
          <a 
            href={PROFILE.cv}
            download="Nikolaos-Fanourakis-CV.pdf"
            className="group inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs shimmer"
          >
            <span className="text-sm">📄</span>
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-xl font-semibold mt-10 mb-4">{children}</h2>;
}

function ExperienceList() {
  return (
    <div id="work">
      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-4">
        {PLACEHOLDERS.experience.map((e, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white/80 dark:bg-slate-900/60 scroll-animate card-hover shimmer backdrop-blur-sm">
            <div className="flex items-baseline justify-between">
              <div className="font-medium">{e.role} — <span className="text-slate-500">{e.org}</span></div>
              <div className="text-sm text-slate-500">{e.period}</div>
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{e.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationList() {
  return (
    <div id="education">
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-3">
        {PLACEHOLDERS.education.map((e, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white/80 dark:bg-slate-900/60 scroll-animate card-hover shimmer backdrop-blur-sm">
            <div className="font-medium">{e.degree}</div>
            <div className="text-sm text-slate-500">{e.inst} — {e.period}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div id="projects">
      <SectionTitle>Projects</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {PLACEHOLDERS.projects.map((p, i) => (
          <article key={i} className="p-4 border rounded-lg scroll-animate card-hover shimmer bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm">
            <div className="font-medium">{p.title}</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{p.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Publications() {
  return (
    <div id="publications">
      <SectionTitle>Publications</SectionTitle>
      <ul className="space-y-3">
        {PLACEHOLDERS.publications.map((pub, i) => (
          <li key={i} className="p-4 border rounded-lg bg-white/80 dark:bg-slate-900/60 scroll-animate card-hover shimmer backdrop-blur-sm flex justify-between items-start">
            <div>
              <div className="font-medium">{pub.title}</div>
              <div className="text-sm text-slate-500">{pub.venue} • {pub.year}</div>
            </div>
            <div>
              <a href={pub.link} className="text-sm underline">PDF</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Presentations() {
  return (
    <div id="presentations">
      <SectionTitle>Presentations</SectionTitle>
      <div className="space-y-4">
        {PLACEHOLDERS.presentations.map((pres, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white/80 dark:bg-slate-900/60 scroll-animate card-hover shimmer backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium">{pres.title}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{pres.event}</div>
                <div className="mt-1 text-sm text-slate-500">{pres.date} • {pres.location}</div>
              </div>
              <div>
                <a href={pres.link} className="text-sm underline">View</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Certifications() {
  return (
    <div id="certifications">
      <SectionTitle>Certifications</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {PLACEHOLDERS.certifications.map((cert, i) => (
          <div key={i} className="p-4 border rounded-lg bg-white/80 dark:bg-slate-900/60 scroll-animate card-hover shimmer backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cert.badge}</span>
                  <div className="font-medium">{cert.title}</div>
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{cert.issuer}</div>
                <div className="mt-1 text-sm text-slate-500">
                  Issued: {cert.date} • Expires: {cert.expiry}
                </div>
              </div>
              <div>
                <a href={cert.link} className="text-sm underline">View</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



function PhotosPage() {
  const [active, setActive] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [photosWithMetadata, setPhotosWithMetadata] = useState([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  // Pagination functionality - commented out for now
  // const [currentPage, setCurrentPage] = useState(1);
  // const photosPerPage = 9;

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const extractMetadataFromUrl = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const tags = await ExifReader.load(arrayBuffer);
      
      console.log('EXIF tags found:', tags); // Debug log
      
      // Extract camera information
      const model = tags.Model?.description || '';
      const camera = model.replace('NIKON ', '').replace('Z50_2', 'Z50II').trim() || 'Unknown Camera';
      
      // Extract shooting parameters
      const focalLength = tags.FocalLength?.description;
      const aperture = tags.FNumber?.description;
      const iso = tags.ISOSpeedRatings?.description || tags.ISO?.description;
      const shutterSpeed = tags.ExposureTime?.description;
      
      // Build clean equipment string in desired format
      const params = [];
      params.push(camera);
      if (focalLength) params.push(`${focalLength}`);
      if (aperture) params.push(`${aperture}`);
      if (shutterSpeed) params.push(`${shutterSpeed}s`);
      if (iso) params.push(`ISO ${iso}`);
      
      return params.join(' ');
    } catch (error) {
      console.log('Failed to extract EXIF metadata:', error);
      return 'Equipment information not available';
    }
  };

  useEffect(() => {
    const loadPhotosWithMetadata = async () => {
      setLoadingMetadata(true);
      const photosWithExtractedMetadata = await Promise.all(
        PLACEHOLDERS.photos.map(async (photo) => {
          const extractedEquipment = await extractMetadataFromUrl(photo.src);
          return {
            ...photo,
            equipment: extractedEquipment // Use only extracted metadata
          };
        })
      );
      
      setPhotosWithMetadata(photosWithExtractedMetadata);
      setLoadingMetadata(false);
    };

    loadPhotosWithMetadata();
  }, []);

  const allPhotos = photosWithMetadata.length > 0 ? photosWithMetadata : PLACEHOLDERS.photos;
  
  // Filter photos based on active filter
  const filteredPhotos = activeFilter === 'all' 
    ? allPhotos 
    : allPhotos.filter(photo => photo.category === activeFilter);
  
  // Pagination logic - commented out for now
  // const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  // const startIndex = (currentPage - 1) * photosPerPage;
  // const endIndex = startIndex + photosPerPage;
  // const currentPhotos = filteredPhotos.slice(startIndex, endIndex);
  
  // Reset to first page when filter changes
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [activeFilter]);
  
  // Show all filtered photos when pagination is disabled
  const currentPhotos = filteredPhotos;
  
  const currentIndex = active ? filteredPhotos.findIndex(p => p.id === active.id) : -1;
  const hasNext = currentIndex < filteredPhotos.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNextPhoto = () => {
    if (hasNext) {
      setActive(filteredPhotos[currentIndex + 1]);
    }
  };

  const handlePrevPhoto = () => {
    if (hasPrev) {
      setActive(filteredPhotos[currentIndex - 1]);
    }
  };

  return (
    <div className="relative">
      {/* Equipment Side Panel */}
      <div className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-10 w-64">
        <div className="p-4 border rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span>📷</span>
            Equipment
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-1 text-sm">Cameras</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
                  <span className="text-lg">📸</span>
                  <div>
                    <div className="font-medium text-xs">Nikon Z50 II</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">APS-C Mirrorless</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
                  <span className="text-lg">📱</span>
                  <div>
                    <div className="font-medium text-xs">iPhone 13 Pro</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Mobile Photography</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-1 text-sm">Lenses</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
                  <span className="text-lg">🔍</span>
                  <div>
                    <div className="font-medium text-xs">NIKKOR Z 16-50mm f/3.5-6.3</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Everyday-use</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
                  <span className="text-lg">🔍</span>
                  <div>
                    <div className="font-medium text-xs">Viltrox 56mm f/1.7</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Portrait lens</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Unchanged */}
      <Container>
        <div className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Photography</h1>
            
            {loadingMetadata && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="animate-spin">⚙️</span>
                Analyzing EXIF metadata...
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Filter:</span>
            {[
              { key: 'all', label: 'All' },
              { key: 'nature', label: 'Nature' },
              { key: 'portrait', label: 'Portrait' },
              { key: 'street', label: 'Street' },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`
                  inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeFilter === filter.key 
                    ? 'bg-gray-400 hover:bg-gray-500 text-white shadow-lg transform scale-105' 
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                  }
                `}
              >
                {filter.label}
                {filter.key !== 'all' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[1rem] text-center ${
                    activeFilter === filter.key 
                      ? 'bg-gray-300 text-gray-800' 
                      : 'bg-slate-200 dark:bg-slate-600'
                  }`}>
                    {allPhotos.filter(p => p.category === filter.key).length}
                  </span>
                )}
                {filter.key === 'all' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[1rem] text-center ${
                    activeFilter === filter.key 
                      ? 'bg-gray-300 text-gray-800' 
                      : 'bg-slate-200 dark:bg-slate-600'
                  }`}>
                    {allPhotos.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentPhotos.map((photo, index) => (
            <div key={photo.id} className="group overflow-hidden rounded-lg border cursor-pointer relative" 
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   setActive(photo);
                 }}>
              {imageErrors[photo.id] ? (
                <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="text-2xl mb-2">📸</div>
                    <div className="text-sm">Photo {photo.id}</div>
                  </div>
                </div>
              ) : (
                <>
                  <img 
                    src={photo.src} 
                    alt={photo.caption} 
                    className="object-cover w-full h-56 transition-transform duration-200 group-hover:scale-105" 
                    onError={() => handleImageError(photo.id)}
                  />
                  {/* Hover overlay with title */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="text-white text-center px-4">
                      <p className="font-medium text-sm">{photo.caption}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          </div>

          {/* Pagination Controls - commented out for now
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                }`}
              >
                ‹ Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gray-400 hover:bg-gray-500 text-white shadow-lg'
                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                }`}
              >
                Next ›
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPhotos.length)} of {filteredPhotos.length} photos
              {activeFilter !== 'all' && ` in ${activeFilter}`}
            </div>
          )}
          */}

          {/* Equipment Section for Mobile/Tablet */}
          <div className="xl:hidden mt-8 p-6 border rounded-lg bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📷</span>
              Camera Equipment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Cameras</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
                    <span className="text-2xl">📸</span>
                    <div>
                      <div className="font-medium">Nikon Z50 II</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">APS-C Mirrorless</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
                    <span className="text-2xl">📱</span>
                    <div>
                      <div className="font-medium">iPhone 13 Pro</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Mobile Photography</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Lenses</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
                    <span className="text-2xl">🔍</span>
                    <div>
                      <div className="font-medium">NIKKOR Z 16-50mm f/3.5-6.3</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Everyday-use</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
                    <span className="text-2xl">🔍</span>
                    <div>
                      <div className="font-medium">Viltrox 56mm f/1.7</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Portrait lens</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
            {active && (
              <Lightbox 
                src={active.src} 
                caption={active.caption} 
                equipment={active.equipment} 
                onClose={() => setActive(null)}
                onNext={handleNextPhoto}
                onPrev={handlePrevPhoto}
                hasNext={hasNext}
                hasPrev={hasPrev}
              />
            )}
            
            {/* Photography Footer */}
            <footer className="mt-12 mb-6 pb-12">
              <div className="text-sm text-slate-500 text-center">All photographs are for portfolio and personal use only. Images are not available for commercial usage without explicit permission</div>
            </footer>
      </div>
    </Container>
    </div>
  );
}

function HomePage() {
  useScrollToHash();
  useScrollAnimation();
  return (
    <main>
      <Hero />
      <Container>
        <div className="scroll-animate"><ExperienceList /></div>
        <div className="scroll-animate"><EducationList /></div>
        <div className="scroll-animate"><Certifications /></div>
        <div className="scroll-animate"><Projects /></div>
        <div className="scroll-animate"><Publications /></div>
        <div className="scroll-animate"><Presentations /></div>
        <footer className="mt-12 mb-6 pb-12 text-sm text-slate-500">© {new Date().getFullYear()} {PROFILE.name}</footer>
      </Container>
    </main>
  );
}

export default function App() {
  const [theme, setTheme] = useTheme();
  return (
    <Router>
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Header theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photos" element={<PhotosPage />} />
        </Routes>
      </div>
    </Router>
  );
}
