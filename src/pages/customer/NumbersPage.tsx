import { useState } from 'react';
import { PhoneCall, Globe, MessageSquare, Copy, Check, Clock, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface FictionalNumber {
  id: string;
  country: string;
  flag: string;
  code: string;
  number: string;
  service: string;
  expiresInMinutes: number;
  simulatedSms: { sender: string; code: string; text: string; time: string }[];
}

export function NumbersPage() {
  const [copied, setCopied] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');

  const activeNumber: FictionalNumber = {
    id: 'fict_num_01',
    country: 'United States',
    flag: '🇺🇸',
    code: '+1',
    number: '+1 (555) 019-2834',
    service: 'Telegram Verification (Fictional)',
    expiresInMinutes: 14,
    simulatedSms: [
      {
        sender: 'Telegram',
        code: '849-210',
        text: 'Your Telegram login code is 849-210. Do not share this code with anyone.',
        time: 'Just now',
      },
    ],
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Fictional Telecom Sandbox
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Virtual Numbers Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate disposable SMS verification numbers without real telco provisioning or OTP
            capture.
          </p>
        </div>

        <Badge variant="warning" className="text-xs">
          Fictional Placeholders
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Country Selector Card */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-primary" />
              <span>Select Test Country</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              {[
                { code: 'US', name: 'United States', flag: '🇺🇸', rate: '$0.85' },
                { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', rate: '$0.95' },
                { code: 'DE', name: 'Germany', flag: '🇩🇪', rate: '$1.10' },
                { code: 'CA', name: 'Canada', flag: '🇨🇦', rate: '$0.90' },
                { code: 'NL', name: 'Netherlands', flag: '🇳🇱', rate: '$1.05' },
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCountry === c.code
                      ? 'border-brand-primary bg-brand-primary/10 text-white font-semibold'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                  <span className="font-mono text-brand-primary">{c.rate}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Number & Simulated SMS Reader */}
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Active Test Lease</div>
                  <div className="text-base font-extrabold text-white font-mono flex items-center gap-2">
                    <span>{activeNumber.number}</span>
                    <button
                      onClick={() => copyToClipboard(activeNumber.number)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Number"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Expires in
                </span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {activeNumber.expiresInMinutes}:00 min
                </span>
              </div>
            </div>

            {/* Simulated SMS Inbox */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>Simulated SMS Inbox</span>
                </h4>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-slate-400">
                  <RefreshCw className="w-3 h-3" />
                  <span>Simulate Incoming</span>
                </Button>
              </div>

              <div className="space-y-3">
                {activeNumber.simulatedSms.map((sms, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-primary">{sms.sender}</span>
                      <span className="text-slate-500">{sms.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{sms.text}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Extracted OTP:</span>
                      <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary font-mono font-bold text-xs tracking-wider">
                        {sms.code}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
