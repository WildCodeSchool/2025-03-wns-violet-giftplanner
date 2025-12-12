import { useState } from "react";
import "./contact.css";
import { LuCheck, LuCopy } from "react-icons/lu";

const ContactPage = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="contact-background">
      <img className="infohome-serpentin" src="/images/serpentin-jaune.png" alt="Serpentin Jaune" />
      <img className="infohome-carre" src="/images/carre-vert.png" alt="Carré vert" />
      <img className="infohome-etoile" src="/images/etoile-rose.png" alt="Etoile rose" />
      <img className="infohome-cotillon" src="/images/cotillon-bleu.png" alt="Cotillon rouge" />

      <a href="/">
        <img className="contact-logo" src="/images/logo-clair.png" alt="Logo" />
      </a>
      <div className="contact-content">
        <h1 className="contact-title">Contactez nous</h1>
        <p className="contact-description">
          Une question ? Un problème avec votre compte ? Notre équipe est là pour vous aider.
        </p>

        <div className="contact-team-grid">
          <div className="contact-team-member">
            <img src="/images/clement.png" alt="Clément" className="contact-member-image" />
            <h3 className="contact-member-name">Clément</h3>
            <div className="contact-member-email-container">
              <span className="contact-member-email">clement@giftchat.com</span>
              <button
                onClick={() => copyEmail("clement@giftchat.com")}
                className="contact-copy-button"
                title="Copier l'email"
              >
                {copiedEmail === "clement@giftchat.com" ? (
                  <LuCheck className="contact-copy-icon" />
                ) : (
                  <LuCopy className="contact-copy-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="contact-team-member">
            <img src="/images/evelyne.png" alt="Evelyne" className="contact-member-image" />
            <h3 className="contact-member-name">Evelyne</h3>
            <div className="contact-member-email-container">
              <span className="contact-member-email">evelyne@giftchat.com</span>
              <button
                onClick={() => copyEmail("evelyne@giftchat.com")}
                className="contact-copy-button"
                title="Copier l'email"
              >
                {copiedEmail === "evelyne@giftchat.com" ? (
                  <LuCheck className="contact-copy-icon" />
                ) : (
                  <LuCopy className="contact-copy-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="contact-team-member">
            <img src="/images/wolfgang.png" alt="Wolfgang" className="contact-member-image" />
            <h3 className="contact-member-name">Wolfgang</h3>
            <div className="contact-member-email-container">
              <span className="contact-member-email">wolfgang@giftchat.com</span>
              <button
                onClick={() => copyEmail("wolfgang@giftchat.com")}
                className="contact-copy-button"
                title="Copier l'email"
              >
                {copiedEmail === "wolfgang@giftchat.com" ? (
                  <LuCheck className="contact-copy-icon" />
                ) : (
                  <LuCopy className="contact-copy-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="contact-team-member">
            <img src="/images/chloe.png" alt="Chloé" className="contact-member-image" />
            <h3 className="contact-member-name">Chloé</h3>
            <div className="contact-member-email-container">
              <span className="contact-member-email">chloe@giftchat.com</span>
              <button
                onClick={() => copyEmail("chloe@giftchat.com")}
                className="contact-copy-button"
                title="Copier l'email"
              >
                {copiedEmail === "chloe@giftchat.com" ? (
                  <LuCheck className="contact-copy-icon" />
                ) : (
                  <LuCopy className="contact-copy-icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="contact-back-link">
          <a href="/" className="button-white-contact">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
