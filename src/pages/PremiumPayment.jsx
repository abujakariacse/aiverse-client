import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Gem, Check, CreditCard, ShieldCheck, HelpCircle } from 'lucide-react';
import './PremiumPayment.css';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock_fallback_key';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Initialize Stripe outside rendering
let stripePromise;
try {
  stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
} catch (e) {
  console.warn('Failed to load Stripe SDK. Check your public API key.');
}

const CheckoutForm = ({ planDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { token, updateProfileState } = useAuth();
  const navigate = useNavigate();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [stripeError, setStripeError] = useState('');
  const [mockTrigger, setMockTrigger] = useState(!import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setPaymentLoading(true);
      setStripeError('');

      // 1. Create payment intent on server
      const intentResponse = await fetch(`${API_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const intentData = await intentResponse.json();

      if (!intentResponse.ok) {
        throw new Error(intentData.message || 'Server error creating Stripe payment intent');
      }

      const clientSecret = intentData.clientSecret;

      // 2. Confirm card payment via Stripe
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        // 3. Confirm success on server and upgrade
        await completeUpgrade(result.paymentIntent.id, result.paymentIntent.receipt_email || 'stripe-buyer@aiverse.com');
      }
    } catch (err) {
      console.error(err);
      setStripeError(err.message || 'Payment processing failed');
      toast.error(err.message || 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const completeUpgrade = async (transactionId, email) => {
    try {
      const response = await fetch(`${API_URL}/payment/success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionId,
          email,
          amount: planDetails.price,
        }),
      });

      if (response.ok) {
        toast.success('Payment successful! Your account is upgraded to Pro Premium.');
        // Update user state dynamically
        updateProfileState({ subscriptionStatus: 'premium' });
        navigate(-1); // Go back to details page
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update premium credentials on database');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error logging transaction details');
    }
  };

  // Mock checkout handler for testing environments
  const handleMockUpgrade = async () => {
    try {
      setPaymentLoading(true);
      const randomTxnId = 'mock_txn_' + Math.random().toString(36).substring(2, 11).toUpperCase();
      await completeUpgrade(randomTxnId, 'tester-premium@aiverse.com');
    } catch (err) {
      toast.error('Mock upgrade failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-payment-form">
      <h3 className="form-title"><CreditCard size={18} /> Card Information</h3>
      
      {stripeError && <div className="card-error-notice">{stripeError}</div>}

      <div className="card-element-wrapper glass-panel">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#f8fafc',
                fontFamily: 'system-ui, sans-serif',
                '::placeholder': { color: '#64748b' },
              },
              invalid: { color: '#f43f5e' },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={paymentLoading || !stripe}
        className="btn btn-primary payment-submit-btn"
      >
        {paymentLoading ? 'Processing transaction...' : `Pay One-time $${planDetails.price}.00`}
      </button>

      {/* Mock checkout helper */}
      <div className="mock-payment-drawer">
        <div className="divider-line">
          <span>Stripe Testing Assist</span>
        </div>
        <p className="mock-assist-desc">
          No credit card configured? Or running locally without keys? Use our Sandbox simulation to instantly test upgraded views and dashboards.
        </p>
        <button
          type="button"
          onClick={handleMockUpgrade}
          disabled={paymentLoading}
          className="btn btn-accent mock-upgrade-btn"
        >
          Simulate $5 Test Checkout
        </button>
      </div>
    </form>
  );
};

const PremiumPayment = () => {
  const { user } = useAuth();

  const planDetails = {
    title: 'Aiverse Pro Access',
    price: 5.00,
    benefits: [
      'Unlock all locked Private/Premium prompts',
      'Unlimited copy-to-clipboard actions',
      'Engage with rating and feedback reviews',
      'Priority access to future AI engine configurations',
      'One-time payment, lifetime ownership',
    ],
  };

  return (
    <div className="payment-page-container">
      <div className="payment-header-center">
        <div className="payment-icon-shield">
          <Gem size={28} className="text-secondary" />
        </div>
        <h1>Upgrade Your Account</h1>
        <p>Unlock premium prompt engineering templates and advanced assets</p>
      </div>

      <div className="payment-workspace-grid">
        {/* Plan Details Card */}
        <motion.div
          className="plan-details-card glass-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="plan-badge">Lifetime Plan</div>
          <h2>{planDetails.title}</h2>
          
          <div className="plan-price-block">
            <span className="currency">$</span>
            <span className="price">{planDetails.price}.00</span>
            <span className="period">/ one-time</span>
          </div>

          <div className="benefits-checklist">
            {planDetails.benefits.map((benefit, i) => (
              <div key={i} className="benefit-row">
                <div className="check-dot">
                  <Check size={14} />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="secure-badge">
            <ShieldCheck size={16} className="text-success" />
            <span>Payments secured and encrypted via Stripe Gateway.</span>
          </div>
        </motion.div>

        {/* Stripe CardElement input */}
        <motion.div
          className="payment-card-input-card glass-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm planDetails={planDetails} />
            </Elements>
          ) : (
            <div className="stripe-load-error">
              <h3>Gateway Error</h3>
              <p>Unable to load Stripe checkout library. Use Sandbox checkout below.</p>
              <CheckoutForm planDetails={planDetails} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumPayment;
