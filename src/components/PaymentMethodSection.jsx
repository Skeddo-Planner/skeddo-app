import { useState, useEffect } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";
import { supabase } from "../lib/supabase";
import { C } from "../constants/brand";

/* ── Card brand display names ── */
const BRAND_LABELS = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
  discover: "Discover",
  diners: "Diners",
  jcb: "JCB",
  unionpay: "UnionPay",
};

/* ── Card brand icons (simple text fallback) ── */
const BRAND_ICONS = {
  visa: "\u25A0",
  mastercard: "\u25A0",
  amex: "\u25A0",
  discover: "\u25A0",
};

/* ── Stripe CardElement styling to match Skeddo brand ── */
const CARD_STYLE = {
  base: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    color: "#1B2432",
    "::placeholder": { color: "#4A6FA5" },
  },
  invalid: {
    color: C.danger,
  },
};

/* ── The inner component (needs to be inside <Elements>) ── */
function PaymentMethodInner() {
  const stripe = useStripe();
  const elements = useElements();

  const [savedCard, setSavedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCardInput, setShowCardInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /* ── Get the auth token for API calls ── */
  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token;
  };

  /* ── Fetch existing payment method on mount ── */
  useEffect(() => {
    fetchPaymentMethod();
  }, []);

  const fetchPaymentMethod = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await fetch("/api/stripe-payment-method", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSavedCard(data.paymentMethod || null);
    } catch (err) {
      console.error("Failed to fetch payment method:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Save a new card ── */
  const handleSaveCard = async () => {
    if (!stripe || !elements) return;

    setError(null);
    setSaving(true);
    setSuccess(false);

    try {
      const token = await getToken();
      if (!token) {
        setError("Please sign in again to add a payment method.");
        setSaving(false);
        return;
      }

      /* 1. Create a SetupIntent via our API */
      const setupRes = await fetch("/api/stripe-setup-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!setupRes.ok) {
        const errData = await setupRes.json();
        setError(errData.error || "Failed to start card setup. Please try again.");
        setSaving(false);
        return;
      }

      const { clientSecret } = await setupRes.json();

      /* 2. Confirm the SetupIntent with the card details */
      const { error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setSaving(false);
        return;
      }

      /* 3. Fetch the saved card details */
      await fetchPaymentMethod();
      setShowCardInput(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Save card error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Remove saved card ── */
  const handleRemoveCard = async () => {
    if (!savedCard) return;

    setRemoving(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await fetch("/api/stripe-payment-method", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethodId: savedCard.id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to remove card.");
        setRemoving(false);
        return;
      }

      setSavedCard(null);
    } catch (err) {
      console.error("Remove card error:", err);
      setError("Failed to remove card. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Checking payment info...</div>
      </div>
    );
  }

  /* ── Card saved — show summary ── */
  if (savedCard && !showCardInput) {
    const brandLabel = BRAND_LABELS[savedCard.brand] || savedCard.brand;
    const icon = BRAND_ICONS[savedCard.brand] || "💳";

    return (
      <div style={styles.container}>
        <div style={styles.savedCard}>
          <div style={styles.cardInfo}>
            <span style={styles.cardIcon}>{icon}</span>
            <div>
              <div style={styles.cardBrand}>
                {brandLabel} •••• {savedCard.last4}
              </div>
              <div style={styles.cardExpiry}>
                Expires {String(savedCard.expMonth).padStart(2, "0")}/{savedCard.expYear}
              </div>
            </div>
          </div>
          <button
            style={styles.removeBtn}
            className="del-btn"
            onClick={handleRemoveCard}
            disabled={removing}
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
        {success && (
          <div style={styles.successMsg}>✓ Card saved successfully</div>
        )}
        {error && <div style={styles.errorMsg}>{error}</div>}
      </div>
    );
  }

  /* ── No card — show add button or card input ── */
  return (
    <div style={styles.container}>
      {!showCardInput ? (
        <>
          <div style={styles.infoText}>
            Add a payment method for when you're ready to upgrade. You won't be charged until you choose a paid plan.
          </div>
          <button
            style={styles.addBtn}
            onClick={() => { setShowCardInput(true); setError(null); }}
          >
            + Add Payment Method
          </button>
        </>
      ) : (
        <>
          <div style={styles.cardElementWrapper}>
            <CardElement options={{ style: CARD_STYLE, hidePostalCode: true }} />
          </div>
          {error && <div style={styles.errorMsg}>{error}</div>}
          <div style={styles.btnRow}>
            <button
              style={styles.cancelBtn}
              onClick={() => { setShowCardInput(false); setError(null); }}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              style={{
                ...styles.saveBtn,
                opacity: saving ? 0.7 : 1,
              }}
              onClick={handleSaveCard}
              disabled={saving || !stripe}
            >
              {saving ? "Saving..." : "Save Card"}
            </button>
          </div>
          <div style={styles.secureNote}>
            Your card is securely processed by Stripe. We never see your full card number.
          </div>
        </>
      )}
      {success && (
        <div style={styles.successMsg}>✓ Card saved successfully</div>
      )}
    </div>
  );
}


/* ── Exported wrapper with Elements provider ── */
export default function PaymentMethodSection() {
  /* If Stripe isn't configured (no key), show a placeholder */
  if (!stripePromise) {
    return (
      <div style={styles.container}>
        <div style={styles.infoText}>
          Payment methods will be available soon.
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodInner />
    </Elements>
  );
}


/* ── Inline styles matching Skeddo brand ── */
const styles = {
  container: {
    marginBottom: 8,
  },
  loadingText: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 13,
    color: C.muted,
    padding: "12px 0",
  },
  infoText: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 12,
    color: C.muted,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  savedCard: {
    background: C.cream,
    borderRadius: 12,
    padding: "14px 16px",
    border: `1.5px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardBrand: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: C.ink,
  },
  cardExpiry: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 12,
    color: C.muted,
    marginTop: 1,
  },
  removeBtn: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    color: C.danger,
    background: C.dangerBg,
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  addBtn: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    color: C.seaGreen,
    background: "#E8F5EE",
    border: `1.5px solid ${C.seaGreen}`,
    borderRadius: 10,
    padding: "10px 18px",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.15s",
  },
  cardElementWrapper: {
    background: C.cream,
    border: `1.5px solid ${C.border}`,
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 10,
    transition: "all 0.15s",
  },
  btnRow: {
    display: "flex",
    gap: 8,
    marginBottom: 8,
  },
  cancelBtn: {
    flex: 1,
    fontFamily: "'Barlow', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    background: C.cream,
    color: C.muted,
    border: `1.5px solid ${C.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
  },
  saveBtn: {
    flex: 2,
    fontFamily: "'Barlow', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    background: C.seaGreen,
    color: C.cream,
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  secureNote: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 11,
    color: C.muted,
    textAlign: "center",
    lineHeight: 1.4,
  },
  errorMsg: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 12,
    color: C.danger,
    background: C.dangerBg,
    borderRadius: 8,
    padding: "8px 12px",
    marginTop: 8,
    marginBottom: 8,
  },
  successMsg: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: 12,
    color: C.seaGreen,
    background: "#E8F5EE",
    borderRadius: 8,
    padding: "8px 12px",
    marginTop: 8,
  },
};
