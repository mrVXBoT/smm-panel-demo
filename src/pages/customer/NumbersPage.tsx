import { useState, useMemo } from 'react';
import {
  PhoneCall,
  Globe,
  MessageSquare,
  Copy,
  Check,
  Clock,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { orderRepository } from '../../core/db/orderRepository';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface CountryPreset {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  rateCents: number;
  generateNumber: () => string;
}

const COUNTRIES: CountryPreset[] = [
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    rateCents: 85,
    generateNumber: () => `+1 (555) 019-${Math.floor(1000 + Math.random() * 9000)}`,
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    rateCents: 95,
    generateNumber: () => `+44 7700 ${Math.floor(900000 + Math.random() * 99999)}`,
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    dialCode: '+49',
    rateCents: 110,
    generateNumber: () => `+49 152 ${Math.floor(2000000 + Math.random() * 7999999)}`,
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    dialCode: '+1',
    rateCents: 90,
    generateNumber: () => `+1 (555) 321-${Math.floor(1000 + Math.random() * 9000)}`,
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    dialCode: '+31',
    rateCents: 105,
    generateNumber: () => `+31 6 ${Math.floor(10000000 + Math.random() * 89999999)}`,
  },
];

interface SmsMessage {
  id: string;
  sender: string;
  code: string;
  text: string;
  time: string;
}

export function NumbersPage() {
  const { currentUser } = useAppStore();
  const wallet = useCustomerWallet(currentUser.id);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const activeCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0]!,
    [selectedCountryCode],
  );

  const [activeNumber, setActiveNumber] = useState<string>(COUNTRIES[0]!.generateNumber());
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [leaseSuccess, setLeaseSuccess] = useState<string | null>(null);
  const [insufficientError, setInsufficientError] = useState(false);

  const [messages, setMessages] = useState<SmsMessage[]>([
    {
      id: 'sms_1',
      sender: 'Telegram',
      code: '849-210',
      text: 'Your Telegram login code is 849-210. Do not share this code with anyone.',
      time: 'Just now',
    },
  ]);

  const handleCountrySelect = (country: CountryPreset) => {
    setSelectedCountryCode(country.code);
    const newNum = country.generateNumber();
    setActiveNumber(newNum);
    setLeaseSuccess(null);
    setInsufficientError(false);

    // Initial country-specific welcome SMS
    setMessages([
      {
        id: `sms_${Date.now()}`,
        sender: 'Telegram',
        code: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
        text: `Your ${country.name} simulated verification code is ready. Lease confirmed on fictional channel.`,
        time: 'Just now',
      },
    ]);
  };

  const handleLeaseFreshNumber = async () => {
    setInsufficientError(false);
    if (wallet.balanceCents < activeCountry.rateCents) {
      setInsufficientError(true);
      return;
    }

    const newNum = activeCountry.generateNumber();
    try {
      await orderRepository.placeOrder({
        userId: currentUser.id,
        serviceId: 'srv_num_usa_fictional',
        serviceName: `${activeCountry.name} Fictional Number (${newNum})`,
        target: newNum,
        quantity: 1,
        chargeCents: activeCountry.rateCents,
      });

      setActiveNumber(newNum);
      setLeaseSuccess(`Leased new ${activeCountry.name} demo number: ${newNum}`);
      setMessages([
        {
          id: `sms_${Date.now()}`,
          sender: 'Carrier Test Gateway',
          code: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
          text: `Line activated on fictional network. Waiting for incoming demo OTP payloads.`,
          time: 'Just now',
        },
      ]);
    } catch {
      setInsufficientError(true);
    }
  };

  const handleSimulateIncomingSms = () => {
    const rawOtp = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    const newSms: SmsMessage = {
      id: `sms_${Date.now()}`,
      sender: 'Telegram Security',
      code: rawOtp,
      text: `Your Telegram login code is ${rawOtp}. Requested for ${activeNumber}. Valid for 5 minutes.`,
      time: 'Just now',
    };
    setMessages((prev) => [newSms, ...prev]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const copyOtpCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Fictional Telecom Sandbox
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark tracking-tight">
            Virtual Numbers Simulator
          </h1>
          <p className="text-xs text-brand-muted-dark mt-1">
            Simulate disposable SMS verification numbers across multiple countries without real
            telco provisioning.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-brand-muted-dark">Balance:</span>
          <div className="font-mono text-base font-extrabold text-brand-primary">
            {formatCents(wallet.balanceCents)}
          </div>
        </div>
      </div>

      {leaseSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-brand-success text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-brand-success" />
            <span>{leaseSuccess}</span>
          </div>
          <button
            onClick={() => setLeaseSuccess(null)}
            className="text-brand-success hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {insufficientError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-brand-danger text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-brand-danger shrink-0" />
          <span>
            Insufficient balance to lease this number ({formatCents(activeCountry.rateCents)}{' '}
            required).
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Country Selector Card */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-bold text-sm text-brand-text-dark flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-primary" />
              <span>Select Test Country</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCountrySelect(c)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCountryCode === c.code
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-text-dark font-semibold'
                      : 'border-brand-border bg-brand-surface-dark/50 text-brand-secondary hover:border-brand-border'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                  <span className="font-mono text-brand-primary">{formatCents(c.rateCents)}</span>
                </button>
              ))}
            </div>

            <Button
              onClick={handleLeaseFreshNumber}
              size="sm"
              className="w-full mt-2 gap-1.5 text-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lease New {activeCountry.name} Number</span>
            </Button>
          </CardContent>
        </Card>

        {/* Active Number & Simulated SMS Reader */}
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-brand-success text-xl">
                  {activeCountry.flag}
                </div>
                <div>
                  <div className="text-xs text-brand-muted-dark flex items-center gap-1.5">
                    <span>Active {activeCountry.name} Test Line</span>
                    <Badge variant="success" className="text-[9px] py-0">
                      Online
                    </Badge>
                  </div>
                  <div className="text-lg font-extrabold text-brand-text-dark font-mono flex items-center gap-2 mt-0.5">
                    <span>{activeNumber}</span>
                    <button
                      onClick={() => copyToClipboard(activeNumber)}
                      className="p-1 rounded text-brand-muted-dark hover:text-brand-text-dark transition-colors cursor-pointer"
                      title="Copy Number"
                    >
                      {copiedNumber ? (
                        <Check className="w-4 h-4 text-brand-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-brand-muted-dark flex items-center sm:justify-end gap-1">
                  <Clock className="w-3 h-3 text-brand-warning" />
                  Simulated Lease Duration
                </span>
                <span className="font-mono text-sm font-bold text-brand-warning">
                  14:52 min remaining
                </span>
              </div>
            </div>

            {/* Simulated SMS Inbox */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-brand-text-dark flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-primary" />
                  <span>Simulated SMS Inbox ({messages.length})</span>
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSimulateIncomingSms}
                  className="h-8 text-xs gap-1.5 border-brand-border text-brand-text-dark hover:border-brand-primary cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Simulate Incoming OTP</span>
                </Button>
              </div>

              <div className="space-y-3">
                {messages.map((sms) => (
                  <div
                    key={sms.id}
                    className="p-4 rounded-xl bg-brand-surface-dark/80 border border-brand-border space-y-2 hover:border-brand-border transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-primary flex items-center gap-1.5">
                        <PhoneCall className="w-3 h-3" />
                        {sms.sender}
                      </span>
                      <span className="text-brand-dim text-[11px]">{sms.time}</span>
                    </div>
                    <p className="text-xs text-brand-secondary leading-relaxed font-sans">
                      {sms.text}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-brand-muted-dark">Simulated Code:</span>
                        <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary font-mono font-bold text-xs tracking-wider">
                          {sms.code}
                        </span>
                      </div>
                      <button
                        onClick={() => copyOtpCode(sms.id, sms.code)}
                        className="text-[11px] text-brand-muted-dark hover:text-brand-primary flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedCodeId === sms.id ? (
                          <>
                            <Check className="w-3 h-3 text-brand-success" />
                            <span className="text-brand-success">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
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
