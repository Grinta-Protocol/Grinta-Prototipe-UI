import React, { useState, useEffect } from 'react';
import { ShieldCheck, MoreVertical, ArrowDownUp, Info, ChevronDown, RefreshCw, Bitcoin } from 'lucide-react';
import { useAccount, useSendTransaction } from '@starknet-react/core';
import { config } from '../config/contracts';
import { useRates, useUserSafes } from '../hooks/useGrinta';
import { parseBtcAmount, parseGritAmount, btcToWad, formatWad, formatWadPercent } from '../lib/starknet';

export default function SafeActions() {
  const [activeTab, setActiveTab] = useState('new_safe');
  const [amount, setAmount] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [selectedSafeId, setSelectedSafeId] = useState<number | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [safeDropdownOpen, setSafeDropdownOpen] = useState(false);

  const { address } = useAccount();
  const { sendAsync, isPending } = useSendTransaction({});
  const rates = useRates();
  const { safes, isLoading: safesLoading, refetch: refetchSafes, debug } = useUserSafes();

  // Auto-select first safe when safes load
  useEffect(() => {
    if (safes.length > 0 && selectedSafeId === null) {
      setSelectedSafeId(safes[0].id);
    }
  }, [safes, selectedSafeId]);

  // Auto-switch to SAFE tab when user has safes
  useEffect(() => {
    if (safes.length > 0 && activeTab === 'new_safe') {
      setActiveTab('safe');
    }
  }, [safes]);

  const selectedSafe = safes.find(s => s.id === selectedSafeId) || null;

  const handleMintTestWbtc = async () => {
    if (!address || isPending) return;
    try {
      setTxStatus('Minting 1 WBTC...');
      const amt = 100_000_000n;
      await sendAsync([
        {
          contractAddress: config.wbtcAddress,
          entrypoint: 'mint',
          calldata: [address, `0x${amt.toString(16)}`, '0x0'],
        },
      ]);
      setTxStatus('Minted 1 WBTC!');
    } catch (err) {
      console.error('mint failed:', err);
      setTxStatus(`Mint error: ${(err as Error).message}`);
    }
  };

  const handleOpenSafe = async () => {
    if (!address || isPending) return;
    try {
      setTxStatus('Creating SAFE...');
      await sendAsync([
        {
          contractAddress: config.safeManagerAddress,
          entrypoint: 'open_safe',
          calldata: [],
        },
      ]);
      setTxStatus('SAFE created! Refreshing...');
      setTimeout(() => refetchSafes(), 3000);
    } catch (err) {
      console.error('open_safe failed:', err);
      setTxStatus(`Error: ${(err as Error).message}`);
    }
  };

  const handleSafeAction = async (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => {
    if (!address || selectedSafeId === null || !amount || isPending) return;

    try {
      setTxStatus('Confirming...');
      let calls: { contractAddress: string; entrypoint: string; calldata: string[] }[] = [];
      const sid = selectedSafeId.toString();

      if (action === 'deposit') {
        const parsed = parseBtcAmount(amount);
        if (parsed <= 0n) return;
        calls = [
          {
            contractAddress: config.wbtcAddress,
            entrypoint: 'approve',
            calldata: [config.collateralJoinAddress, `0x${parsed.toString(16)}`, '0x0'],
          },
          {
            contractAddress: config.safeManagerAddress,
            entrypoint: 'deposit',
            calldata: [sid, `0x${parsed.toString(16)}`, '0x0'],
          },
        ];
      } else if (action === 'withdraw') {
        const btcParsed = parseBtcAmount(amount);
        const wadAmount = btcToWad(btcParsed);
        if (wadAmount <= 0n) return;
        calls = [
          {
            contractAddress: config.safeManagerAddress,
            entrypoint: 'withdraw',
            calldata: [sid, `0x${wadAmount.toString(16)}`, '0x0'],
          },
        ];
      } else if (action === 'borrow') {
        const parsed = parseGritAmount(amount);
        if (parsed <= 0n) return;
        calls = [
          {
            contractAddress: config.safeManagerAddress,
            entrypoint: 'borrow',
            calldata: [sid, `0x${parsed.toString(16)}`, '0x0'],
          },
        ];
      } else if (action === 'repay') {
        const parsed = parseGritAmount(amount);
        if (parsed <= 0n) return;
        calls = [
          {
            contractAddress: config.safeEngineAddress,
            entrypoint: 'approve',
            calldata: [config.safeManagerAddress, `0x${parsed.toString(16)}`, '0x0'],
          },
          {
            contractAddress: config.safeManagerAddress,
            entrypoint: 'repay',
            calldata: [sid, `0x${parsed.toString(16)}`, '0x0'],
          },
        ];
      }

      await sendAsync(calls);
      setTxStatus('Transaction sent!');
      setAmount('');
      setTimeout(() => refetchSafes(), 3000);
    } catch (err) {
      console.error(`${action} failed:`, err);
      setTxStatus(`Error: ${(err as Error).message}`);
    }
  };

  const tabs = [
    { id: 'new_safe', label: 'New SAFE' },
    { id: 'safe', label: `SAFE${safes.length > 0 ? ` (${safes.length})` : ''}` }
  ];

  const isSafe = activeTab === 'safe';
  const notConnected = !address;

  const glowBg = isSafe ? 'bg-[#F7931A]' : 'bg-grinta-accent';
  const textAccent = isSafe ? 'text-[#F7931A]' : 'text-grinta-accent';
  const tabActiveShadow = isSafe ? 'shadow-[0_0_15px_rgba(247,147,26,0.2)]' : 'shadow-[0_0_15px_rgba(74,222,128,0.2)]';
  const buttonShadow = isSafe ? 'shadow-[0_0_20px_rgba(247,147,26,0.3)]' : 'shadow-[0_0_20px_rgba(74,222,128,0.3)]';

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8">
      <div className={`absolute -inset-10 ${glowBg}/20 blur-[100px] rounded-full pointer-events-none transition-colors duration-500`}></div>

      <div className="relative bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 ${glowBg}/10 blur-[80px] pointer-events-none transition-colors duration-500`}></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Manage Safe</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-grinta-text-secondary">
              <ShieldCheck size={14} className={textAccent} />
              Audited
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white hover:bg-white/5 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* APY Info */}
        <div className="flex items-center gap-2 mb-6 text-sm relative z-10">
          <span className="text-grinta-text-secondary">Borrow APY</span>
          <span className={`font-semibold ${textAccent}`}>{rates.loading ? 'Loading...' : rates.redemptionRate}</span>
          <Info size={14} className="text-grinta-text-secondary" />
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5 relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setTxStatus(null); }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${activeTab === tab.id
                  ? `${glowBg} text-black ${tabActiveShadow}`
                  : 'text-grinta-text-secondary hover:text-white hover:bg-white/5'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Not connected */}
        {notConnected && (
          <div className="relative z-10 text-center py-8 text-grinta-text-secondary">
            Connect your wallet to interact with SAFEs
          </div>
        )}

        {/* Testnet Faucet */}
        {!notConnected && (
          <div className="relative z-10 mb-6">
            <button
              onClick={handleMintTestWbtc}
              disabled={isPending}
              className="w-full py-3 rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/10 text-sm font-semibold text-[#F7931A] hover:bg-[#F7931A]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="text-lg">₿</span>
              {isPending ? 'Minting...' : 'Mint 1 Test WBTC (Sepolia Faucet)'}
            </button>
          </div>
        )}

        {/* Content */}
        {!notConnected && (
          <div className="relative z-10">
            {activeTab === 'new_safe' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center py-4">
                  <p className="text-grinta-text-secondary text-sm mb-6">
                    Create a new SAFE to deposit collateral and borrow GRIT
                  </p>
                  <button
                    onClick={handleOpenSafe}
                    disabled={isPending}
                    className={`w-full py-5 rounded-2xl ${glowBg} text-black font-bold text-lg hover:brightness-110 transition-all ${buttonShadow} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isPending ? 'Confirming...' : 'CREATE NEW SAFE'}
                  </button>
                </div>
                {txStatus && (
                  <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-xs text-grinta-accent">{txStatus}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* SAFE Selector */}
                {safesLoading ? (
                  <div className="text-center py-4 text-grinta-text-secondary text-sm">
                    Scanning for your SAFEs...
                  </div>
                ) : safes.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-grinta-text-secondary text-sm mb-4">No SAFEs found for your wallet</p>
                    <button
                      onClick={() => setActiveTab('new_safe')}
                      className="text-sm font-semibold text-grinta-accent hover:underline"
                    >
                      Create one
                    </button>
                  </div>
                ) : (
                  <>
                    {/* SAFE Dropdown */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-grinta-text-secondary mb-2">Select SAFE</label>
                      <div
                        onClick={() => setSafeDropdownOpen(!safeDropdownOpen)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSafeDropdownOpen(!safeDropdownOpen); }}
                        className="w-full flex items-center justify-between bg-grinta-input border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F7931A]/20 flex items-center justify-center text-[#F7931A]">
                            <ShieldCheck size={16} />
                          </div>
                          <span className="font-semibold text-lg">
                            SAFE #{selectedSafeId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); refetchSafes(); }}
                            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white transition-colors"
                            title="Refresh"
                          >
                            <RefreshCw size={12} />
                          </button>
                          <ChevronDown size={18} className={`text-grinta-text-secondary transition-transform ${safeDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {safeDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-grinta-card border border-grinta-card-border rounded-2xl p-2 shadow-xl backdrop-blur-xl z-20 max-h-48 overflow-y-auto">
                          {safes.map((safe) => (
                            <button
                              key={safe.id}
                              onClick={() => { setSelectedSafeId(safe.id); setSafeDropdownOpen(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm ${safe.id === selectedSafeId ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-grinta-text-secondary'
                                }`}
                            >
                              <span className="font-semibold">SAFE #{safe.id}</span>
                              <span className="text-xs">
                                {formatWad(safe.collateral, 'BTC')} / {formatWad(safe.debt, 'GRIT')}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selected SAFE Details */}
                    {selectedSafe && (
                      <div className="grid grid-cols-2 gap-3 p-4 bg-black/20 border border-white/5 rounded-2xl">
                        <div>
                          <div className="text-xs text-grinta-text-secondary mb-1">Collateral</div>
                          <div className="font-semibold text-white flex items-center gap-1">
                            <span className="text-[#F7931A]">₿</span> {formatWad(selectedSafe.collateral, 'BTC')}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-grinta-text-secondary mb-1">Debt</div>
                          <div className="font-semibold text-white">{formatWad(selectedSafe.debt, 'GRIT')}</div>
                        </div>
                        <div>
                          <div className="text-xs text-grinta-text-secondary mb-1">LTV</div>
                          <div className="font-semibold text-white">{formatWadPercent(selectedSafe.ltv)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-grinta-text-secondary mb-1">Liq. Price</div>
                          <div className="font-semibold text-white">${formatWad(selectedSafe.liquidationPrice)}</div>
                        </div>
                      </div>
                    )}

                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-grinta-text-secondary mb-2">Amount</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => {
                          if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
                        }}
                        className="w-full bg-grinta-input border border-white/5 rounded-2xl p-4 text-2xl font-bold text-white placeholder:text-white/20 outline-none hover:border-white/10 transition-colors"
                        placeholder="0.0"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button
                        onClick={() => handleSafeAction('deposit')}
                        disabled={selectedSafeId === null || !amount || isPending}
                        className="py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? 'Confirming...' : 'Deposit WBTC'}
                      </button>
                      <button
                        onClick={() => handleSafeAction('withdraw')}
                        disabled={selectedSafeId === null || !amount || isPending}
                        className="py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? 'Confirming...' : 'Withdraw WBTC'}
                      </button>
                      <button
                        onClick={() => handleSafeAction('borrow')}
                        disabled={selectedSafeId === null || !amount || isPending}
                        className="py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? 'Confirming...' : 'Borrow GRIT'}
                      </button>
                      <button
                        onClick={() => handleSafeAction('repay')}
                        disabled={selectedSafeId === null || !amount || isPending}
                        className="py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? 'Confirming...' : 'Repay GRIT'}
                      </button>
                    </div>
                  </>
                )}

                {txStatus && (
                  <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-xl">
                    <p className="text-xs text-grinta-accent">{txStatus}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
