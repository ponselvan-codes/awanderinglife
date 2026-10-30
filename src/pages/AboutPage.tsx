import { GitFork, ExternalLink, Shield, AlertTriangle, Info, Stamp, BookOpen } from 'lucide-react';
import { getCollectionStats } from '../lib/utils';

export default function AboutPage() {
  const stats = getCollectionStats();

  return (
    <div>
      {/* Header */}
      <div className="page-title-band">
        <div className="container-main">
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">About This Collection</h1>
          <p className="text-gray-300">
            India PPC &amp; Philately Passport Collection
          </p>
        </div>
      </div>

      <div className="container-main py-10 max-w-4xl">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Important Disclaimer</p>
            <p className="text-sm text-amber-700">
              This is a <strong>personal collection website</strong> and is not affiliated with, 
              endorsed by, or an official website of <strong>India Post</strong> or the 
              Department of Posts, Government of India. All collection data is personal 
              and for documentation purposes only.
            </p>
          </div>
        </div>

        {/* About section */}
        <section className="card p-6 mb-6" aria-labelledby="about-heading">
          <div className="flex items-center gap-3 mb-4">
            <Stamp className="w-6 h-6 text-[var(--color-crimson)]" aria-hidden="true" />
            <h2 id="about-heading" className="text-xl font-bold font-serif text-[var(--color-charcoal)]">
              About This Website
            </h2>
          </div>
          <div className="prose prose-sm max-w-none text-[var(--color-charcoal)] space-y-4">
            <p>
              This website documents a personal philatelic collection of <strong>Indian Permanent 
              Pictorial Cancellations (PPC)</strong> and <strong>Philately Passport stamps and seals</strong>.
            </p>
            <p>
              A Permanent Pictorial Cancellation (PPC) is a special type of cancellation issued 
              permanently by a post office, featuring a pictorial design that represents the local 
              area, heritage site, monument, or other significant feature associated with that 
              particular post office. Collectors request PPCs by sending postcards or covers to 
              the respective post offices.
            </p>
            <p>
              The Philately Passport is a special booklet issued by India Post that philatelic 
              enthusiasts can get stamped and sealed at various philatelic exhibitions, events, 
              and special postal bureaus across India. Each seal or stamp records a visit to a 
              philatelic event.
            </p>
            <p>
              This collection currently documents <strong>{stats.total} PPC entries</strong> and{' '}
              <strong>{stats.passportSeals} Philately Passport seals</strong>, with{' '}
              <strong>{stats.received} PPCs received</strong> and{' '}
              <strong>{stats.requestedAwaiting} awaiting receipt</strong>.
            </p>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="card p-6 mb-6" aria-labelledby="tech-heading">
          <div className="flex items-center gap-3 mb-4">
            <GitFork className="w-6 h-6 text-[var(--color-charcoal)]" aria-hidden="true" />
            <h2 id="tech-heading" className="text-xl font-bold font-serif text-[var(--color-charcoal)]">
              Technical Architecture
            </h2>
          </div>
          <div className="text-sm text-[var(--color-charcoal)] space-y-3">
            <p>
              This website uses a <strong>fully static architecture</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--color-text-muted)]">
              <li>Built with <strong className="text-[var(--color-charcoal)]">React + Vite + TypeScript + Tailwind CSS</strong></li>
              <li>Hosted on <strong className="text-[var(--color-charcoal)]">GitHub Pages</strong> — no server required</li>
              <li>Collection data stored as <strong className="text-[var(--color-charcoal)]">JSON files</strong> in the GitHub repository</li>
              <li>Images stored as <strong className="text-[var(--color-charcoal)]">files in the repository</strong> (no external storage)</li>
              <li>No database — no Supabase, Firebase, MySQL, or any external database</li>
              <li>Deployed automatically via <strong className="text-[var(--color-charcoal)]">GitHub Actions</strong></li>
            </ul>
          </div>
        </section>

        {/* Admin workflow */}
        <section id="admin" className="card p-6 mb-6" aria-labelledby="admin-heading">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[var(--color-crimson)]" aria-hidden="true" />
            <h2 id="admin-heading" className="text-xl font-bold font-serif text-[var(--color-charcoal)]">
              Administration &amp; Security
            </h2>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm text-blue-800">
              <strong>No frontend authentication is used.</strong> This is a deliberate 
              security decision — there are no admin passwords hidden in JavaScript bundles, 
              localStorage, or environment variables.
            </div>
          </div>

          <div className="text-sm text-[var(--color-charcoal)] space-y-3">
            <p>
              Because this website is hosted on GitHub Pages (a static hosting service), 
              all administration is performed through the GitHub repository itself:
            </p>
            <div className="bg-[var(--color-cream-dark)] rounded-lg p-4 font-mono text-xs space-y-1">
              <div className="text-[var(--color-crimson)] font-bold">ADMIN WORKFLOW:</div>
              <div>1. Authenticate to GitHub (your GitHub account)</div>
              <div>2. Edit src/data/ppc.json or src/data/passport.json</div>
              <div>3. Upload images to public/images/ppc/ or public/images/passport/</div>
              <div>4. Commit and push changes to the repository</div>
              <div>5. GitHub Actions automatically rebuilds and deploys the website</div>
              <div>6. Changes appear on the live website within minutes</div>
            </div>
            <p>
              This approach is <strong>more secure</strong> than any frontend authentication, 
              because only a person with proper GitHub repository access can modify collection data.
              GitHub's own authentication (2FA, SSH keys, etc.) protects the repository.
            </p>
          </div>
        </section>

        {/* GitHub link */}
        <section className="card p-6 mb-6" aria-labelledby="github-heading">
          <h2 id="github-heading" className="text-xl font-bold font-serif text-[var(--color-charcoal)] mb-4">
            Repository
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            The source code and collection data for this website are maintained in a GitHub repository:
          </p>
          <a
            href="https://github.com/your-username/india-ppc-collection"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full sm:w-auto justify-center"
            id="github-link-about"
          >
            <GitFork className="w-4 h-4" aria-hidden="true" />
            View on GitHub
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <p className="text-xs text-[var(--color-text-muted)] mt-3">
            Replace the URL above with your actual GitHub repository URL after setup.
          </p>
        </section>

        {/* Collection stats */}
        <section className="card p-6" aria-labelledby="stats-about-heading">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-[var(--color-gold)]" aria-hidden="true" />
            <h2 id="stats-about-heading" className="text-xl font-bold font-serif text-[var(--color-charcoal)]">
              Current Collection Statistics
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total PPC', value: stats.total },
              { label: 'Received', value: stats.received },
              { label: 'Awaiting Receipt', value: stats.requestedAwaiting },
              { label: 'Not Requested', value: stats.notRequested },
              { label: 'With Images', value: stats.withImages },
              { label: 'Passport Seals', value: stats.passportSeals },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-3 bg-[var(--color-surface-alt)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-crimson)]">{value}</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
            Statistics are calculated dynamically from collection data and update automatically 
            when new entries are added to the repository.
          </p>
        </section>
      </div>
    </div>
  );
}
