import { useLocation } from 'react-router-dom';
import { ProductExperience } from '../../features/products/ProductExperience';
export function StarsPage() {
  const location = useLocation();
  return <ProductExperience key={location.search} kind="stars" />;
}
