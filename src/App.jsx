import Hero from './components/Hero';
import PasswordGenerator from './components/PasswordGenerator';
import FeatureHighlights from './components/FeatureHighlights';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Hero />
      <main className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          <PasswordGenerator />
        </div>
        <div className="mt-16">
          <FeatureHighlights />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
