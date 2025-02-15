import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import emailjs from '@emailjs/browser';



type FormData = {
  fullName: string;
  email: string;
  companyName: string;
  currentOTP: string;
  monthlyUsage: string;
};

const otpSolutions = [
  'Google Authenticator',
  'Authy',
  'Microsoft Authenticator',
  'SMS-based OTP',
  'Email-based OTP',
  'Other'
];

const Spinner = () => (
  <div className="loader"></div>
);

function App() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    companyName: '',
    currentOTP: '',
    monthlyUsage: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    console.log(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    // Initialize EmailJS with your public key
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '');

  }, []);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Send email using EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
        {
          to_name: 'MOJA Waitlist Admin',
          from_name: formData.fullName,
          from_email: formData.email,
          company_name: formData.companyName || 'Not provided',
          current_otp: formData.currentOTP || 'Not provided',
          monthly_usage: formData.monthlyUsage || 'Not provided',
          message: `New waitlist signup:
            Full Name: ${formData.fullName}
            Email: ${formData.email}
            Company: ${formData.companyName || 'Not provided'}
            Current OTP Solution: ${formData.currentOTP || 'Not provided'}
            Expected Monthly Usage: ${formData.monthlyUsage || 'Not provided'}`
        }
      );

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError('Something went wrong. Please try again later.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Joining!</h2>
          <p className="text-gray-600">
            We've received your request to join the waitlist. We'll be in touch soon with more information about our next-gen OTP delivery solution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <img src="/moja_text_log_light.svg" alt="Moja" className="h-18 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Join the Waitlist for Next-Gen OTP Delivery
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
           Frustrated with inconsistent OTP delivery and rising costs? Our solution provides reliable, secure authentication with budget-friendly pricing that fits any business without breaking the bank.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="currentOTP" className="block text-sm font-medium text-gray-700 mb-1">
                Current OTP Solution
              </label>
              <select
                id="currentOTP"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                value={formData.currentOTP}
                onChange={(e) => setFormData({ ...formData, currentOTP: e.target.value })}
              >
                <option value="">Select an option</option>
                {otpSolutions.map((solution) => (
                  <option key={solution} value={solution}>
                    {solution}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="monthlyUsage" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Monthly Usage
              </label>
              <input
                type="text"
                id="monthlyUsage"
                placeholder="e.g., 10,000 authentications"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                value={formData.monthlyUsage}
                onChange={(e) => setFormData({ ...formData, monthlyUsage: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4CAF50] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Spinner  />
                  Submitting...
                </>
              ) : (
                'Join Waitlist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;