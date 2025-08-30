import { Shield, Zap, Eye, Cpu } from 'lucide-react';

export default function FeatureHighlights() {
  const features = [
    {
      icon: Shield,
      title: 'Secure by design',
      desc: 'Cryptographically strong randomness using the Web Crypto API. No data is sent to any server.'
    },
    {
      icon: Zap,
      title: 'Fast & simple',
      desc: 'Generate strong passwords with one click. Clean controls keep the experience delightful.'
    },
    {
      icon: Eye,
      title: 'Readable when needed',
      desc: 'Toggle visibility and use chunked formatting to avoid mistakes when typing.'
    },
    {
      icon: Cpu,
      title: 'Works offline',
      desc: 'Entirely client-side. Once loaded, it continues to work without a network connection.'
    },
  ];

  return (
    <section>
      <h3 className="text-lg font-semibold">Why this generator?</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
              <f.icon className="h-5 w-5 text-cyan-300" />
            </div>
            <h4 className="font-medium">{f.title}</h4>
            <p className="mt-1 text-sm text-neutral-300">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
