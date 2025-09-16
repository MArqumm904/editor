import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S3jP8Ga82wEgQIECUgkPwuAx7GJx1EcbDIbZ5g0bN1Vt7IjtbDpKbQl4aRjNWRYfsrNp9dtMTC8S0ZLop60v5ZI00Bhb70jAd');

const PaymentForm = ({ amount, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState(null);

  useEffect(() => {
    createPaymentIntent();
  }, [amount]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd'
        }),
      });

      const data = await response.json();
      
      if (data.client_secret) {
        setClientSecret(data.client_secret);
      } else {
        onError(data.message || 'Failed to create payment intent');
      }
    } catch (error) {
      onError('Network error. Please try again.');
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      onError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      try {
        const response = await fetch('http://localhost:8000/api/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntent.id
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          onSuccess(paymentIntent);
        } else {
          onError(data.message || 'Payment confirmation failed');
        }
      } catch (error) {
        onError('Payment confirmation failed');
      }
      
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': {
          color: '#9CA3AF',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '400',
      },
      invalid: {
        color: '#EF4444',
      },
      complete: {
        color: '#10B981',
      }
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-5">
      {/* Card Information Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#8088E2] bg-opacity-10 rounded-lg">
            <CreditCard className="w-4 h-4 text-[#8088E2]" />
          </div>
          <span className="text-sm font-medium text-gray-700">Card Information</span>
          {cardComplete && (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <CheckCircle className="w-3 h-3" />
              <span>Valid</span>
            </div>
          )}
        </div>
        
        <div className={`p-4 border rounded-xl bg-white transition-all duration-200 ${
          cardComplete 
            ? 'border-green-300 bg-green-50 bg-opacity-30' 
            : cardError 
              ? 'border-red-300 bg-red-50 bg-opacity-30'
              : 'border-gray-200 hover:border-[#8088E2] hover:border-opacity-50'
        }`}>
          <CardElement options={cardElementOptions} onChange={handleCardChange} />
        </div>

        {cardError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-red-500 text-sm"
          >
            {cardError}
          </motion.p>
        )}
        
        <div className="flex items-center gap-2 text-green-600 text-xs bg-green-50 p-2.5 rounded-lg">
          <Lock className="w-3 h-3" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      {/* Buttons */}
      <form onSubmit={handleSubmit} className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing || !cardComplete}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            isProcessing || !cardComplete
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#8088E2] text-white hover:bg-[#6B73D6] shadow-md hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Pay $${amount}`
          )}
        </button>
      </form>
    </div>
  );
};

const StripePaymentModal = ({ isOpen, onClose, amount, onSuccess, onError }) => {
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.15
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const handleSuccess = (paymentIntent) => {
    onSuccess(paymentIntent);
    onClose();
  };

  const handleError = (error) => {
    onError(error);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Complete Payment</h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  Donation amount: <span className="font-semibold text-[#8088E2]">${amount}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 bg-gray-100 rounded-full transition-colors duration-150"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={amount}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  onCancel={onClose}
                />
              </Elements>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StripePaymentModal;