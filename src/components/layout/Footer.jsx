import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IU</span>
              </div>
              <span className="font-bold text-lg text-white">GPA Calculator</span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm">
              Built for Iqra University students. Track your academic performance across semesters with real-time GPA calculations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Log In</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><span className="hover:text-primary transition-colors cursor-pointer">Grade Scale</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">GPA Formula</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">FAQ</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Iqra University GPA Calculator. All rights reserved.
          </p>
          <p className="text-zinc-600 text-xs">
            Made with care for IU students
          </p>
        </div>
      </div>
    </footer>
  )
}
