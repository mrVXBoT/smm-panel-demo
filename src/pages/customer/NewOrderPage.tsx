import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productRoute } from '../../core/utils/productRoutes';
import './NewOrderPage.css';
const products = [
  {
    name: 'Telegram Stars',
    detail: 'Choose a Stars bundle and preview your gift.',
    path: '/app/stars',
    art: 'stars',
    label: 'A LITTLE STAR POWER',
  },
  {
    name: 'Telegram Premium',
    detail: 'Explore 3 and 12-month subscription gifts.',
    path: '/app/premium',
    art: 'premium',
    label: 'SOMETHING SPECIAL',
  },
  {
    name: 'Channel Growth',
    detail: 'Build your campaign for members, views or reactions.',
    path: '/app/growth',
    art: 'growth',
    label: 'YOUR NEXT CHAPTER',
  },
];
export function NewOrderPage() {
  const [params] = useSearchParams();
  const serviceId = params.get('service');
  const destination = serviceId ? productRoute(serviceId) : null;
  if (destination && destination !== '/app/order/new') return <Navigate to={destination} replace />;
  return (
    <div className="order-launcher">
      <header>
        <span>NEW ORDER</span>
        <h1>What would you like to create?</h1>
        <p>Choose a product to open its dedicated order studio.</p>
      </header>
      <div className="order-launcher-grid">
        {products.map((product) => (
          <Link key={product.path} to={product.path} className={`launcher-${product.art}`}>
            <div>
              <img src={`/images/nova-${product.art}-world.png`} alt="" />
            </div>
            <span>{product.label}</span>
            <h2>{product.name}</h2>
            <p>{product.detail}</p>
            <strong>
              Open {product.name} <ArrowRight size={16} />
            </strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
