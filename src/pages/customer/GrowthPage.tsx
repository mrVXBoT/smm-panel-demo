import { useLocation } from 'react-router-dom';
import { ProductExperience } from '../../features/products/ProductExperience';
export function GrowthPage() {
  const location = useLocation();
  return <ProductExperience key={location.search} kind="growth" />;
}
