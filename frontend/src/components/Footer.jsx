import React from 'react';
import { Globe, DollarSign, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="staynest-footer">
      <div className="container footer-content">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#aircover">StayCover Protection</a></li>
              <li><a href="#safety">Anti-discrimination</a></li>
              <li><a href="#disability">Disability support</a></li>
              <li><a href="#cancellation">Cancellation options</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hosting</h4>
            <ul>
              <li><a href="#host">StayNest your home</a></li>
              <li><a href="#aircover-hosts">StayCover for Hosts</a></li>
              <li><a href="#resources">Hosting resources</a></li>
              <li><a href="#community">Community forum</a></li>
              <li><a href="#responsible">Hosting responsibly</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>StayNest</h4>
            <ul>
              <li><a href="#news">Newsroom</a></li>
              <li><a href="#features">New features</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#investors">Investors</a></li>
              <li><a href="#giftcards">StayNest.org emergency stays</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} StayNest, Inc.</span>
            <span>·</span>
            <a href="#privacy">Privacy</a>
            <span>·</span>
            <a href="#terms">Terms</a>
            <span>·</span>
            <a href="#sitemap">Sitemap</a>
            <span>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Crafted with <Heart size={14} fill="#FF385C" color="#FF385C" /> for travelers worldwide
            </span>
          </div>

          <div className="footer-bottom-right">
            <button className="footer-pill-btn">
              <Globe size={16} /> English (US)
            </button>
            <button className="footer-pill-btn">
              <span style={{ fontWeight: 700 }}>₹</span> INR
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .staynest-footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-light);
          padding-top: 48px;
          margin-top: 60px;
        }
        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--border-medium);
        }
        .footer-col h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 16px;
        }
        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-col a {
          color: #484848;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .footer-col a:hover {
          color: var(--text-main);
          text-decoration: underline;
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .footer-bottom-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .footer-bottom-left a:hover {
          text-decoration: underline;
        }
        .footer-bottom-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .footer-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.88rem;
        }
        .footer-pill-btn:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .footer-columns {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
