import { BrandGlyph, CardPattern } from '../../../components/brand/BrandGlyph';

export function PricingAssurances() {
  return (
    <section className="pricing-assurances" aria-label="Privacy and order processing">
      <article className="assurance-card assurance-privacy">
        <CardPattern variant="premium" />
        <div className="assurance-art">
          <div className="assurance-art-glow" />
          <BrandGlyph kind="privacy" />
        </div>
        <div className="assurance-copy">
          <span className="assurance-eyebrow">PRIVATE BY DESIGN</span>
          <h2>
            Your channel.
            <br />
            Your keys.
          </h2>
          <p>
            No Telegram passwords. No OTPs. No bot admin access. Keep your account access private
            only.
          </p>
          <div className="privacy-contract">
            <span>@your_channel</span>
            <span className="privacy-contract-divider" />
            <strong>Credentials stay yours</strong>
          </div>
        </div>
      </article>
      <article className="assurance-card assurance-processing">
        <CardPattern variant="growth" />
        <div className="assurance-art">
          <div className="assurance-art-glow" />
          <BrandGlyph kind="processing" />
        </div>
        <div className="assurance-copy">
          <span className="assurance-eyebrow">CLARITY IN MOTION</span>
          <h2>
            A clear path.
            <br />
            Every step.
          </h2>
          <p>Follow each stage in your panel, with clear states and recorded activity.</p>
          <ol className="assurance-flow" aria-label="Order stages">
            <li>
              <span />
              Queued
            </li>
            <li>
              <span />
              Processing
            </li>
            <li>
              <span />
              Complete
            </li>
          </ol>
        </div>
      </article>
    </section>
  );
}
