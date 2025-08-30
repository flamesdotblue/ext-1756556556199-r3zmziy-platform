import Spline from '@splinetool/react-spline';
import { Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[540px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/0 via-neutral-950/20 to-neutral-950" />

      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
            <Shield className="h-5 w-5 text-cyan-300" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
            Secure passwords, instantly
          </h1>
          <p className="mt-4 text-neutral-300">
            A simple, delightful password generator that balances security and usability. Tune your options, generate, and copy with a click.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl">
            <Zap className="h-4 w-4 text-amber-300" />
            <span className="text-sm text-neutral-200">Client-side only · No data leaves your browser</span>
          </div>
        </div>
      </div>
    </section>
  );
}
