import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Check } from 'lucide-react';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { INITIAL_CATEGORIES } from '../../core/fixtures/categories';
import { formatCents } from '../../core/utils/currency';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

export function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = INITIAL_SERVICES.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
    const matchesQuery =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="accent" className="mb-3">
          Telegram Services
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore Telegram Growth & Digital Products
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base">
          Automated fulfillment for Telegram Stars, official Premium gift passes, and non-drop
          channel growth services.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-brand-primary text-slate-950 shadow-md shadow-brand-primary/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Services ({INITIAL_SERVICES.length})
          </button>
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-brand-primary text-slate-950 shadow-md shadow-brand-primary/25'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="pl-10 text-xs"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className="flex flex-col justify-between hover:border-brand-primary/50 transition-all"
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {service.platform.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-slate-400">{service.estimatedDeliveryLabel}</span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-brand-primary transition-colors">
                  {service.name}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{service.description}</p>

                {service.features && (
                  <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Rate</div>
                  <div className="text-lg font-extrabold text-brand-primary font-mono">
                    {service.pricePerThousandCents
                      ? `${formatCents(service.pricePerThousandCents)} / 1k`
                      : service.fixedPriceCents
                        ? `${formatCents(service.fixedPriceCents)} fixed`
                        : '$0.00'}
                  </div>
                </div>

                <Link to={`/app/order/new?service=${service.id}`}>
                  <Button size="sm" className="gap-1.5 font-semibold cursor-pointer">
                    <span>Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No services found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or switching categories.
          </p>
        </div>
      )}
    </div>
  );
}
