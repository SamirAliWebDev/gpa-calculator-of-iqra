import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import HeroSection from '../components/ui/glassmorphism-trust-hero'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    title: 'Track Every Semester',
    desc: 'Add subjects with credit hours and grades. Your semester GPA calculates instantly.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Real-Time Calculation',
    desc: 'See your GPA update as you change grades. No more manual math.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Save & Access Anywhere',
    desc: 'Your data syncs across devices. Log in from anywhere, anytime.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Iqra University Scale',
    desc: 'Pre-loaded with IU grading scale. C (2.00) minimum, probation at 1.70.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Add Your Subjects',
    desc: 'Enter each subject name, credit hours, and select your grade from the dropdown.',
  },
  {
    num: '02',
    title: 'See Instant Results',
    desc: 'Your semester GPA and quality points calculate automatically in real-time.',
  },
  {
    num: '03',
    title: 'Track Your Progress',
    desc: 'Build your academic history across semesters and monitor your cumulative GPA.',
  },
]

const gradeRows = [
  { grade: 'A', range: '90% – 100%', points: '4.00' },
  { grade: 'A-', range: '85% – 89%', points: '3.67' },
  { grade: 'B+', range: '80% – 84%', points: '3.33' },
  { grade: 'B', range: '75% – 79%', points: '3.00' },
  { grade: 'B-', range: '70% – 74%', points: '2.67' },
  { grade: 'C+', range: '65% – 69%', points: '2.33' },
  { grade: 'C', range: '60% – 64%', points: '2.00' },
  { grade: 'C-', range: '55% – 59%', points: '1.67' },
  { grade: 'D+', range: '50% – 54%', points: '1.33' },
  { grade: 'D', range: '45% – 49%', points: '1.00' },
  { grade: 'F', range: 'Below 45%', points: '0.00' },
]

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
              Everything You Need
            </h2>
            <p className="mt-4 text-zinc-400">
              A complete GPA tracking solution designed for Iqra University students.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-primary/5 backdrop-blur-sm transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
              Three Steps to Clarity
            </h2>
            <p className="mt-4 text-zinc-400">
              Track your academic progress in seconds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                whileHover={{ y: -4 }}
                className="relative p-8 rounded-2xl bg-white/5 border border-white/10 text-center group hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-primary/5 backdrop-blur-sm transition-all duration-300"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-white/10" />
                )}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white text-xl font-bold mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GPA Scale */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Reference</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
              Iqra University Grading Scale
            </h2>
            <p className="mt-4 text-zinc-400">
              The complete grading system used for GPA calculation.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="max-w-2xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-primary-dark text-white">
                  <th className="px-6 py-3.5 text-left text-sm font-semibold">Grade</th>
                  <th className="px-6 py-3.5 text-left text-sm font-semibold">Percentage</th>
                  <th className="px-6 py-3.5 text-right text-sm font-semibold">Grade Points</th>
                </tr>
              </thead>
              <tbody>
                {gradeRows.map((row, i) => (
                  <motion.tr
                    key={row.grade}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'} hover:bg-white/5 transition-colors`}
                  >
                    <td className="px-6 py-3 text-sm font-semibold text-white">{row.grade}</td>
                    <td className="px-6 py-3 text-sm text-zinc-400">{row.range}</td>
                    <td className="px-6 py-3 text-sm font-medium text-accent text-right">{row.points}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="max-w-2xl mx-auto mt-6 flex flex-col sm:flex-row gap-4 text-sm text-zinc-400"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span><strong className="text-white">C (2.00)</strong> — Minimum for degree requirement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span><strong className="text-white">C- (1.67)</strong> — Probation threshold (1.70 SGPA)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 sm:p-16 text-center"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
              >
                Ready to Take Control of Your Grades?
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                className="text-zinc-400 max-w-lg mx-auto mb-8"
              >
                Join Iqra University students who are already using this tool to monitor their academic progress.
              </motion.p>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
              >
                <Link to="/register">
                  <Button variant="accent" size="lg" className="group">
                    Create Free Account
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
