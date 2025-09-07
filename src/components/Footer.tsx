export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SUN</span>
              </div>
              <span className="text-xl font-bold">Step Up Naija</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Empowering Nigerian communities through civic engagement and the #13kCredibleChallenge.
            </p>
            <div className="space-y-2 text-gray-400 text-sm mb-4">
              <p>📧 info@stepupnaija.org</p>
              <p>📱 +234 (0) 906 586 3057</p>
              <p>📍 Abuja, Nigeria</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://x.com/Step_up_naija" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" data-testid="link-twitter">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61572251606931" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" data-testid="link-facebook">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.instagram.com/step_up_naija/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" data-testid="link-instagram">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.65-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.245 17.818.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.009 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@Step_Up_Naija/shorts" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" data-testid="link-youtube">
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@step_up_naija" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" data-testid="link-tiktok">
                <span className="sr-only">TikTok</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.936-1.316-2.045-1.316-3.128C16.425.632 16.425 0 16.425 0H12.84v15.47c0 .056 0 .109-.004.165a3.482 3.482 0 0 1-3.476 3.317A3.482 3.482 0 0 1 5.878 15.47a3.482 3.482 0 0 1 3.482-3.482c.36 0 .705.056 1.029.159v-3.604a7.066 7.066 0 0 0-1.029-.074A7.066 7.066 0 0 0 2.295 15.47a7.066 7.066 0 0 0 7.065 7.064 7.066 7.066 0 0 0 7.065-7.064V7.901a9.648 9.648 0 0 0 5.623 1.8V5.885a5.113 5.113 0 0 1-2.727-.323z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors" data-testid="link-footer-about">Our Mission</a></li>
              <li><a href="/challenge" className="hover:text-white transition-colors" data-testid="link-footer-challenge">#13K Challenge</a></li>
              <li><a href="/transparency" className="hover:text-white transition-colors" data-testid="link-footer-transparency">Transparency</a></li>
              <li><a href="/progress" className="hover:text-white transition-colors" data-testid="link-footer-progress">Impact Report</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/engage" className="hover:text-white transition-colors" data-testid="link-footer-engage">Engage & Earn</a></li>
              <li><a href="/network" className="hover:text-white transition-colors" data-testid="link-footer-network">Network</a></li>
              <li><a href="/projects" className="hover:text-white transition-colors" data-testid="link-footer-projects">Community Projects</a></li>
              <li><a href="/candidates" className="hover:text-white transition-colors" data-testid="link-footer-leaders">Leadership Board</a></li>
              <li><a href="/treasury" className="hover:text-white transition-colors" data-testid="link-footer-analytics">Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/help" className="hover:text-white transition-colors" data-testid="link-footer-faq">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors" data-testid="link-footer-contact">Contact</a></li>
              <li><a href="/verification" className="hover:text-white transition-colors" data-testid="link-footer-verification">Verification</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors" data-testid="link-footer-api">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2025 CIRAD Foundation (RC: 7651). All rights reserved.</p>
              <p className="mt-1">Building credible leadership across Nigeria's 774 LGAs</p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="/terms" className="hover:text-white transition-colors" data-testid="link-footer-terms">Terms</a>
              <a href="/privacy" className="hover:text-white transition-colors" data-testid="link-footer-privacy">Privacy</a>
              <a href="/security" className="hover:text-white transition-colors" data-testid="link-footer-security">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}