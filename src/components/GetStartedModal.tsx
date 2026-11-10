import React, { useState } from 'react';
import { X, Check, ShieldCheck, Key, Copy, CheckCircle2 } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'scooting.around@gmail.com',
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'trader' | 'pro' | 'institutional'>('pro');
  const [copiedKey, setCopiedKey] = useState(false);
  const [mockApiKey] = useState('mp_live_948f21e04a98b71d93c4e72a');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[4px] flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFFFFF] rounded-[16px] shadow-2xl border border-[#E0E3EB] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#131722] text-white flex items-center justify-center font-bold">
              MP
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#131722] tracking-tight">
                Institutional Terminal Access
              </h3>
              <p className="text-[12px] text-[#737687]">
                Welcome {userEmail}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F0F3FA] text-[#737687] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#737687] mb-2">
              Select Workspace Environment
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'trader', name: 'Retail Pro', price: 'Free' },
                { id: 'pro', name: 'Desk Analyst', price: '$49/mo' },
                { id: 'institutional', name: 'Macro Prime', price: '$249/mo' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedPlan(tier.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPlan === tier.id
                      ? 'border-[#2962FF] bg-[#2962FF]/5 ring-1 ring-[#2962FF]'
                      : 'border-[#E0E3EB] hover:bg-[#F0F3FA]'
                  }`}
                >
                  <div className="text-[13px] font-bold text-[#131722]">{tier.name}</div>
                  <div className="text-[12px] font-semibold text-[#2962FF] mt-0.5">{tier.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Features Included */}
          <div className="p-3.5 bg-[#F0F3FA] rounded-xl border border-[#E0E3EB] space-y-2 text-[12px]">
            <div className="flex items-center gap-2 text-[#131722] font-medium">
              <Check className="w-4 h-4 text-[#089981]" />
              <span>Real-time sub-second streaming quotes (NYSE, NASDAQ, CME, LSE)</span>
            </div>
            <div className="flex items-center gap-2 text-[#131722] font-medium">
              <Check className="w-4 h-4 text-[#089981]" />
              <span>Full Level 2 order book depth & bid/ask volume ladders</span>
            </div>
            <div className="flex items-center gap-2 text-[#131722] font-medium">
              <Check className="w-4 h-4 text-[#089981]" />
              <span>$100,000 simulated paper trading liquidity account</span>
            </div>
          </div>

          {/* API Credentials */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#737687] mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#2962FF]" />
              <span>Direct WebSocket & REST Data Key</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={mockApiKey}
                className="w-full h-9 px-3 bg-[#F0F3FA] border border-[#E0E3EB] rounded-lg text-[12px] mono-num text-[#434656] select-all outline-none"
              />
              <button
                onClick={handleCopy}
                className="h-9 px-3 bg-[#131722] hover:bg-[#2A2E39] text-white rounded-lg text-[12px] font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copiedKey ? <CheckCircle2 className="w-3.5 h-3.5 text-[#089981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F0F3FA] border-t border-[#E0E3EB] flex items-center justify-between">
          <span className="text-[11px] text-[#737687] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#089981]" />
            SOC2 Type II Certified
          </span>
          <button
            onClick={onClose}
            className="h-9 px-5 rounded-full bg-[#131722] hover:bg-[#2A2E39] text-white text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Enter Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
