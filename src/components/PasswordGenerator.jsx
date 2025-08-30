import { useCallback, useMemo, useState } from 'react';
import { Copy, Check, RefreshCw, Eye, EyeOff, Lock } from 'lucide-react';

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUM = '0123456789';
const SYM = "!@#$%^&*()-_=+[]{};:,.<>/?";

function calculateStrength(password, opts) {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-red-500' };
  const lengthScore = Math.min(10, Math.floor(password.length / 2));
  const variety = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].reduce((acc, r) => acc + (r.test(password) ? 1 : 0), 0);
  const varietyScore = variety * 2.5;
  const uniqueChars = new Set(password).size;
  const uniqueScore = Math.min(10, uniqueChars / 2);
  let score = Math.min(10, Math.round((lengthScore + varietyScore + uniqueScore) / 3.2 * 10) / 10);
  // Penalize if user disabled many sets
  const enabledSets = [opts.lower, opts.upper, opts.number, opts.symbol].filter(Boolean).length;
  if (enabledSets <= 1) score = Math.min(score, 3.5);

  let label = 'Weak', color = 'bg-red-500';
  if (score >= 8) { label = 'Strong'; color = 'bg-emerald-500'; }
  else if (score >= 6) { label = 'Good'; color = 'bg-lime-500'; }
  else if (score >= 4.5) { label = 'Fair'; color = 'bg-yellow-500'; }
  return { score, label, color };
}

function usePassword() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [number, setNumber] = useState(true);
  const [symbol, setSymbol] = useState(false);
  const [ambiguousSafe, setAmbiguousSafe] = useState(true); // avoid easily confused chars
  const [readableChunks, setReadableChunks] = useState(true); // add dashes every n chars for readability
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');

  const charset = useMemo(() => {
    let chars = '';
    if (lower) chars += LOWER;
    if (upper) chars += UPPER;
    if (number) chars += NUM;
    if (symbol) chars += SYM;
    if (ambiguousSafe) chars = chars.replace(/[Il1O0]/g, '');
    return chars;
  }, [lower, upper, number, symbol, ambiguousSafe]);

  const generate = useCallback(() => {
    const sets = [];
    if (lower) sets.push(LOWER);
    if (upper) sets.push(UPPER);
    if (number) sets.push(NUM);
    if (symbol) sets.push(SYM);
    let all = sets.join('');
    if (ambiguousSafe) {
      all = all.replace(/[Il1O0]/g, '');
      sets.forEach((s, i) => { sets[i] = s.replace(/[Il1O0]/g, ''); });
    }
    if (all.length === 0) return '';

    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);

    // Ensure at least one char from each selected set
    const pwd = new Array(length);
    let idx = 0;
    for (const s of sets) {
      if (!s.length) continue;
      const r = bytes[idx++] % s.length;
      pwd[idx - 1] = s[r];
    }
    for (; idx < length; idx++) {
      const r = bytes[idx] % all.length;
      pwd[idx] = all[r];
    }
    // Shuffle using Fisher–Yates with crypto randomness
    for (let i = pwd.length - 1; i > 0; i--) {
      const j = bytes[i] % (i + 1);
      [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
    }

    let out = pwd.join('');
    if (readableChunks && length >= 12) {
      const chunk = 4;
      out = out.match(new RegExp(`.{1,${chunk}}`, 'g')).join('-');
    }
    setValue(out);
    return out;
  }, [length, lower, upper, number, symbol, ambiguousSafe, readableChunks]);

  return { length, setLength, lower, setLower, upper, setUpper, number, setNumber, symbol, setSymbol, ambiguousSafe, setAmbiguousSafe, readableChunks, setReadableChunks, show, setShow, value, setValue, charset, generate };
}

export default function PasswordGenerator() {
  const st = usePassword();
  const [copied, setCopied] = useState(false);
  const [warning, setWarning] = useState('');

  const flatValue = useMemo(() => st.value.replaceAll('-', ''), [st.value]);
  const strength = useMemo(() => calculateStrength(flatValue, st), [flatValue, st]);

  const onGenerate = () => {
    setWarning('');
    const v = st.generate();
    if (!v) setWarning('Select at least one character set.');
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(flatValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    } catch (e) {
      setWarning('Copy failed. Select and copy manually.');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Lock className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Generate a password</h2>
          <p className="text-sm text-neutral-300">Customize your options below. Everything happens locally in your browser.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <label className="mb-2 block text-sm text-neutral-300">Password</label>
          <div className="group relative flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
            <input
              type={st.show ? 'text' : 'password'}
              value={st.value}
              onChange={(e) => st.setValue(e.target.value)}
              placeholder="Click generate to create a secure password"
              className="w-full bg-transparent px-4 py-3.5 outline-none placeholder:text-neutral-500"
            />
            <div className="flex items-center gap-1 pr-1">
              <button
                onClick={() => st.setShow((s) => !s)}
                aria-label={st.show ? 'Hide password' : 'Show password'}
                className="m-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-neutral-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {st.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={onCopy}
                aria-label="Copy password"
                className="m-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-neutral-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={onGenerate}
                className="m-1 mr-1 inline-flex items-center gap-2 rounded-lg bg-cyan-500/90 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <RefreshCw className="h-4 w-4" />
                Generate
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`${strength.color} h-full`} 
                style={{ width: `${Math.max(6, Math.min(100, Math.round((strength.score / 10) * 100)))}%` }}
              />
            </div>
            <span className="text-sm text-neutral-300 w-16 text-right">{strength.label}</span>
          </div>
          {warning && (
            <p className="mt-2 text-sm text-amber-300">{warning}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
            <h3 className="mb-4 text-sm font-semibold text-neutral-200">Options</h3>

            <div className="mb-5">
              <div className="flex items-center justify-between">
                <label htmlFor="length" className="text-sm text-neutral-300">Length: <span className="font-medium text-white">{st.length}</span></label>
              </div>
              <input
                id="length"
                type="range"
                min={8}
                max={64}
                value={st.length}
                onChange={(e) => st.setLength(parseInt(e.target.value))}
                className="mt-2 w-full accent-cyan-400"
              />
              <div className="mt-1 flex justify-between text-xs text-neutral-500">
                <span>8</span><span>32</span><span>64</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Toggle id="lower" label="Lowercase" checked={st.lower} onChange={st.setLower} />
              <Toggle id="upper" label="Uppercase" checked={st.upper} onChange={st.setUpper} />
              <Toggle id="number" label="Numbers" checked={st.number} onChange={st.setNumber} />
              <Toggle id="symbol" label="Symbols" checked={st.symbol} onChange={st.setSymbol} />
              <Toggle id="ambig" label="Avoid ambiguous" checked={st.ambiguousSafe} onChange={st.setAmbiguousSafe} help="Removes characters like 0/O and 1/l" />
              <Toggle id="chunks" label="Readable chunks" checked={st.readableChunks} onChange={st.setReadableChunks} help="Adds dashes for easier reading" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ id, label, checked, onChange, help }) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-cyan-400"
      />
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {help ? <div className="text-xs text-neutral-400">{help}</div> : null}
      </div>
    </label>
  );
}
