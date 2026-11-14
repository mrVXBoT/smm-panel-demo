import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle, ArrowRight, AlertTriangle, Wallet } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../core/fixtures/categories';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';
import { useAppStore } from '../../app/store';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export function NewOrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, addOrder } = useAppStore();

  const preselectedServiceId = searchParams.get('service');
  const initialService =
    INITIAL_SERVICES.find((s) => s.id === preselectedServiceId) || INITIAL_SERVICES[0]!;

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialService.categoryId);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialService.id);
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState<number>(initialService.minQty || 100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const availableServices = useMemo(() => {
    return INITIAL_SERVICES.filter((s) => s.categoryId === selectedCategoryId);
  }, [selectedCategoryId]);

  const activeService = useMemo(() => {
    return (
      INITIAL_SERVICES.find((s) => s.id === selectedServiceId) ||
      availableServices[0] ||
      INITIAL_SERVICES[0]!
    );
  }, [selectedServiceId, availableServices]);

  const computedTotalCents = useMemo(() => {
    if (activeService.fixedPriceCents) {
      return activeService.fixedPriceCents * quantity;
    }
    if (activeService.pricePerThousandCents) {
      return Math.round((activeService.pricePerThousandCents * quantity) / 1000);
    }
    return 0;
  }, [activeService, quantity]);

  const hasInsufficientBalance = currentUser.balanceCents < computedTotalCents;

  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    setOrderError(null);
    const firstInCat = INITIAL_SERVICES.find((s) => s.categoryId === catId);
    if (firstInCat) {
      setSelectedServiceId(firstInCat.id);
      setQuantity(firstInCat.minQty || 1);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (!targetLink.trim()) {
      setOrderError('Please provide a target channel link or username.');
      return;
    }

    if (hasInsufficientBalance) {
      setOrderError(
        `Insufficient balance. You have ${formatCents(
          currentUser.balanceCents,
        )}, but this order requires ${formatCents(computedTotalCents)}. Please top up your demo wallet.`,
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = addOrder({
        serviceId: activeService.id,
        serviceName: activeService.name,
        target: targetLink.trim(),
        quantity,
        chargeCents: computedTotalCents,
      });

      setIsSubmitting(false);

      if (!result.success) {
        setOrderError(result.error || 'Failed to place order.');
      } else if (result.order) {
        setCreatedOrderId(result.order.id);
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            Simulated Order Dispatcher
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create New Demo Order
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose a service, specify target link, and preview dynamic pricing with persistent
            ledger balance.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Available Balance:</span>
          <div className="text-xl font-extrabold font-mono text-brand-primary">
            {formatCents(currentUser.balanceCents)}
          </div>
        </div>
      </div>

      {createdOrderId ? (
        <Card className="border-emerald-500/40 bg-emerald-950/20 text-center py-12">
          <CardContent className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Demo Order #{createdOrderId} Successfully Dispatched!
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Deducted{' '}
              <strong className="font-mono text-emerald-400">
                {formatCents(computedTotalCents)}
              </strong>{' '}
              from your persisted balance. The order is now saved in your history and persists
              across page refreshes.
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setCreatedOrderId(null);
                  setTargetLink('');
                }}
              >
                Place Another Order
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/app/orders')}>
                View Order History
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Form */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Service Category
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
                  >
                    {INITIAL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Specific Service
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => {
                      setSelectedServiceId(e.target.value);
                      const s = INITIAL_SERVICES.find((item) => item.id === e.target.value);
                      if (s) setQuantity(s.minQty || 1);
                      setOrderError(null);
                    }}
                    className="w-full h-11 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
                  >
                    {availableServices.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} —{' '}
                        {srv.pricePerThousandCents
                          ? `${formatCents(srv.pricePerThousandCents)}/1k`
                          : `${formatCents(srv.fixedPriceCents || 0)} fixed`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Link / Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Target Channel / Post Link / Username
                  </label>
                  <Input
                    value={targetLink}
                    onChange={(e) => {
                      setTargetLink(e.target.value);
                      if (orderError) setOrderError(null);
                    }}
                    placeholder="e.g. https://t.me/your_channel or @sample_handle"
                    required
                    className="text-xs"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Simulation only: Enter any test link or public username.
                  </span>
                </div>

                {/* Quantity */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">Quantity</label>
                    <span className="text-[11px] text-slate-400">
                      Min: {activeService.minQty || 1} • Max: {activeService.maxQty || 100000}
                    </span>
                  </div>
                  <Input
                    type="number"
                    min={activeService.minQty || 1}
                    max={activeService.maxQty || 100000}
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(Number(e.target.value));
                      if (orderError) setOrderError(null);
                    }}
                    className="text-xs font-mono"
                    required
                  />
                </div>

                {/* Insufficient balance warning alert */}
                {hasInsufficientBalance && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-rose-200">Insufficient Demo Balance</div>
                      <div>
                        Required:{' '}
                        <span className="font-mono font-bold">
                          {formatCents(computedTotalCents)}
                        </span>
                        , but your wallet has{' '}
                        <span className="font-mono font-bold">
                          {formatCents(currentUser.balanceCents)}
                        </span>
                        .
                      </div>
                      <Link
                        to="/app/wallet"
                        className="inline-flex items-center gap-1 text-brand-primary hover:underline font-semibold mt-1"
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Go to Demo Wallet to top up</span>
                      </Link>
                    </div>
                  </div>
                )}

                {orderError && !hasInsufficientBalance && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs"
                  >
                    {orderError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || hasInsufficientBalance}
                  className="w-full py-5 rounded-xl text-xs font-bold gap-2 mt-4 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Dispatching Order...'
                      : hasInsufficientBalance
                        ? 'Insufficient Balance — Top Up Required'
                        : 'Submit Simulated Order'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Pricing & Service Summary Card */}
          <Card className="h-fit">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Selected Service:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{activeService.name}</div>
                </div>

                <div>
                  <span className="text-slate-400">Speed / Delivery:</span>
                  <div className="text-brand-primary mt-0.5">
                    {activeService.estimatedDeliveryLabel}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Quantity:</span>
                  <div className="font-mono text-slate-200 mt-0.5">{quantity.toLocaleString()}</div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Total Charge:</span>
                  <span className="text-lg font-mono font-extrabold text-brand-primary">
                    {formatCents(computedTotalCents)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                Orders are executed in sandbox mode. Balances adjust persistently in browser storage
                without touching real payment cards.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
