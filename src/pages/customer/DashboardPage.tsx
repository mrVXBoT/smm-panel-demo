import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet, useDashboardOrders } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { OrderVolumeChart } from '../../components/charts/OrderVolumeChart';
import { SpendingBreakdownChart } from '../../components/charts/SpendingBreakdownChart';
import { BrandGlyph, CardPattern } from '../../components/brand/BrandGlyph';
import { dashboardAnalytics } from '../../features/dashboard/analytics';
import './DashboardPage.css';

export function DashboardPage() {
  const { currentUser } = useAppStore();
  const wallet = useCustomerWallet(currentUser.id);
  const orderState = useDashboardOrders(currentUser.id);
  const { orders } = orderState;
  const stats = dashboardAnalytics(orders);
  const message =
    wallet.isLoading || orderState.isLoading
      ? 'Getting your workspace ready…'
      : wallet.balanceCents === 0
        ? 'Ready for a fresh start? Add funds to your wallet.'
        : stats.active
          ? `${stats.active} ${stats.active === 1 ? 'order is' : 'orders are'} in progress. Your next idea starts here.`
          : orders.length
            ? 'You’re all caught up. What will you create next?'
            : 'Your first Telegram order is one small step away.';
  const metrics = [
    {
      title: 'Available balance',
      value: wallet.isLoading ? '…' : formatCents(wallet.balanceCents),
      detail: 'Explore your wallet',
      to: '/app/wallet',
      pattern: 'growth',
    },
    {
      title: 'Orders placed',
      value: orders.length,
      detail: 'Your complete order history',
      to: '/app/orders',
      pattern: 'premium',
    },
    {
      title: 'Net order spend',
      value: formatCents(stats.spentCents),
      detail: 'Excludes refunded orders',
      to: '/app/transactions',
      pattern: 'stars',
    },
    {
      title: 'In progress',
      value: stats.active,
      detail: 'Pending & processing',
      to: '/app/orders',
      pattern: 'growth',
    },
  ] as const;
  return (
    <div className="dashboard-space" aria-busy={orderState.isLoading}>
      {orderState.error && (
        <p role="alert" className="dashboard-panel">
          {orderState.error}
        </p>
      )}
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <span className="dashboard-eyebrow">YOUR WORKSPACE</span>
          <h1>
            Welcome back,
            <br />
            <span>{currentUser.displayName}</span>
          </h1>
          <p aria-live="polite">{message}</p>
          <div className="dashboard-actions">
            <Link
              className="dashboard-primary"
              to={wallet.balanceCents === 0 && !wallet.isLoading ? '/app/wallet' : '/app/order/new'}
            >
              {wallet.balanceCents === 0 && !wallet.isLoading ? 'Add funds' : 'Create an order'}{' '}
              <ArrowRight size={16} />
            </Link>
            <Link to="/app/orders">
              View orders <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="dashboard-nova">
          <div className="dashboard-nova-orbit" aria-hidden="true" />
          <img
            src="/images/nova-working.png"
            alt="Nova checking a holographic order panel"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/nova-mascot.png';
            }}
          />
          <div className="dashboard-nova-note">
            <span aria-hidden="true" />
            {stats.active ? 'Keeping an eye on your queue' : 'Ready for your next idea'}
          </div>
        </div>
      </section>
      <div className="dashboard-metrics">
        {metrics.map((metric, index) => (
          <Link className={`dashboard-metric metric-${index}`} key={metric.title} to={metric.to}>
            <CardPattern variant={metric.pattern} />
            <span>{metric.title}</span>
            <strong>{metric.value}</strong>
            <small>
              {metric.detail} <ArrowRight size={13} />
            </small>
          </Link>
        ))}
      </div>
      <section className="dashboard-panel dashboard-recent">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">PICK UP WHERE YOU LEFT OFF</span>
            <h2>Recent orders</h2>
          </div>
          <Link to="/app/orders">
            All orders <ArrowRight size={15} />
          </Link>
        </div>
        {orderState.isLoading ? (
          <p role="status" className="dashboard-empty">
            Loading your orders…
          </p>
        ) : orderState.error ? (
          <p className="dashboard-empty">Order history is temporarily unavailable.</p>
        ) : stats.recent.length ? (
          <div className="dashboard-order-list">
            {stats.recent.map((order) => (
              <Link to="/app/orders" key={order.id} className="dashboard-order">
                <BrandGlyph kind={order.status === 'completed' ? 'nova' : 'processing'} />
                <div>
                  <strong>
                    {INITIAL_SERVICES.find((service) => service.id === order.serviceId)?.name ??
                      'Archived service'}
                  </strong>
                  <small>
                    {order.id} · {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <span className={`dashboard-status status-${order.status}`}>{order.status}</span>
                <b>{formatCents(order.chargeCents)}</b>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <BrandGlyph kind="launch" />
            <h3>A little spark starts everything.</h3>
            <p>Choose Stars, Premium or Growth to create your first order.</p>
            <Link to="/app/order/new">Explore services →</Link>
          </div>
        )}
      </section>
      <div className="dashboard-analytics">
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <h2>Your week in orders</h2>
              <p>Orders placed over the last 7 days · local time</p>
            </div>
            <span className="dashboard-eyebrow">ORDER COUNT</span>
          </div>
          <OrderVolumeChart data={stats.volume} />
        </section>
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <div>
              <h2>Your service mix</h2>
              <p>Share of all stored orders</p>
            </div>
          </div>
          <SpendingBreakdownChart data={stats.breakdown} />
        </section>
      </div>
      <section>
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">WHAT’S NEXT?</span>
            <h2>Make your next move.</h2>
          </div>
        </div>
        <div className="dashboard-services">
          {[
            {
              key: 'stars',
              title: 'Telegram Stars',
              text: 'A little extra sparkle.',
              to: '/app/stars',
            },
            {
              key: 'premium',
              title: 'Telegram Premium',
              text: 'Give something special.',
              to: '/app/premium',
            },
            {
              key: 'growth',
              title: 'Channel Growth',
              text: 'Room for your next chapter.',
              to: '/app/growth',
            },
          ].map((service) => (
            <Link key={service.key} to={service.to}>
              <img src={`/images/solution-${service.key}.png`} alt="" loading="lazy" />
              <div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
