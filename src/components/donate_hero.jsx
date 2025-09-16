import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User } from "lucide-react";
import leave1 from "../assets/images/leave1.png";
import leave2 from "../assets/images/leave2.png";
import leave3 from "../assets/images/leave3.png";
import leave4 from "../assets/images/leave4.png";
import DollarImage from "../assets/images/dollar.png";

import WaveImage from "../assets/images/wave.png"; 
import SmileImage from "../assets/images/smile.png";
import HappyImage from "../assets/images/happy.png"; 
import LoveImage from "../assets/images/love.png"; 
import HeartImage from "../assets/images/heart.png";
import StripePaymentModal from "./StripePaymentModal"; 

const Donatehero = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [link, setLink] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const fileInputRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  // Scroll animations
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const isFormInView = useInView(formRef, { once: true, margin: "-50px" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const formVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-15, 15, -15],
      rotate: [0, 8, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const amountButtonVariants = {
    hover: {
      scale: 1.08,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#8088E2",
      transition: {
        duration: 0.2,
      },
    },
  };

  const submitButtonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const presetAmounts = [
    { label: "wave", value: 1, image: WaveImage },
    { label: "happy", value: 10, image: HappyImage },
    { label: "smile", value: 5, image: SmileImage },
    { label: "love", value: 20, image: LoveImage },
    { label: "heart", value: 50, image: HeartImage },
    { label: "dollar", value: 100, image: DollarImage },
  ];

  const onSelectAmount = (value) => {
    setSelectedAmount(value);
    setCustomAmount("");
  };

  const onPickImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const amountToSend = customAmount ? Number(customAmount) : selectedAmount;
    
    if (!amountToSend || amountToSend <= 0) {
      setPaymentError("Please select or enter a valid donation amount");
      return;
    }

    // Clear previous messages
    setPaymentError("");
    setPaymentSuccess("");
    
    // Set payment data for the modal
    window.paymentData = {
      name: '',
      email: '',
      anonymous: isAnonymous,
      link: link
    };
    
    // Show payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentSuccess("Payment successful! Thank you for your donation.");
    setShowPaymentModal(false);
    
    // Reset form
    setSelectedAmount(null);
    setCustomAmount("");
    setLink("");
    setIsAnonymous(false);
    setImagePreview(null);
    
    // Clear payment data
    window.paymentData = null;
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setShowPaymentModal(false);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <motion.div 
      className="min-h-screen bg-darkbg relative overflow-hidden flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated floating elements - decorative shapes */}
      <motion.div 
        className="absolute z-0 pointer-events-none top-4 left-5 w-14 h-14 opacity-70 md:top-[-1px] md:left-[200px] md:w-20 md:h-24"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "0s" }}
      >
        <img
          src={leave1}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div 
        className="absolute z-0 pointer-events-none top-6 right-5 w-10 h-10 opacity-70 md:top-[20px] md:right-[215px] md:w-16 md:h-12"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
      >
        <img
          src={leave2}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Main content container */}
      <motion.div 
        className="text-center z-10 px-0 sm:px-4 max-w-6xl mx-auto"
        variants={containerVariants}
      >
        {/* Heading */}
        <motion.h1 
          ref={titleRef}
          className="text-5xl mt-10 md:text-6xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] md:leading-tight max-w-[25ch] mx-auto"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          Your Generosity fuels our <br className="hidden md:block" /> creativity!
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          className="text-xl md:text-xl text-[#b7b7b7] mb-12 max-w-2xl mx-auto"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
        >
          Donate to support free animations, new features, and more magic!
        </motion.p>

        {/* Donation form container */}
        <motion.div 
          ref={formRef}
          className="relative w-full sm:w-[90vw] max-w-[900px] mx-auto pt-8 sm:pt-12 mb-6"
          variants={formVariants}
          initial="hidden"
          animate={isFormInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="relative p-2 bg-gradient-to-b from-[#8087e1] via-[#8087e1] to-[#0d0b13] rounded-[28px] shadow-2xl"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <div className="bg-white rounded-[26px] overflow-hidden">
              <form onSubmit={onSubmit} className="px-4 sm:px-6 md:px-10 py-8 sm:py-10">
                {/* Avatar Uploader */}
                <motion.div 
                  className="flex flex-col items-center"
                  variants={formVariants}
                  initial="hidden"
                  animate={isFormInView ? "visible" : "hidden"}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    type="button"
                    onClick={onPickImage}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#8088E2] bg-white shadow-sm grid place-items-center overflow-hidden"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {imagePreview ? (
                      <motion.img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <User className="w-10 h-10 text-[#8088E2]" />
                    )}
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageChange}
                  />
                  <motion.p 
                    className="text-gray-600 mt-3 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    Add Image
                  </motion.p>
                  <motion.p 
                    className="text-gray-400 -mt-1 text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    (optional)
                  </motion.p>
                </motion.div>

                {/* Preset Amounts */}
                <motion.div 
                  className="mt-8 grid grid-cols-3 sm:flex sm:flex-row gap-3 sm:gap-4 justify-center"
                  variants={formVariants}
                  initial="hidden"
                  animate={isFormInView ? "visible" : "hidden"}
                  transition={{ delay: 0.4 }}
                >
                  {presetAmounts.map((a, index) => {
                    const active = selectedAmount === a.value && !customAmount;
                    return (
                      <motion.button
                        key={a.value}
                        type="button"
                        onClick={() => onSelectAmount(a.value)}
                        className={`w-20 h-16 sm:w-24 sm:h-20 rounded-xl border transition-all duration-200 shadow-sm relative overflow-hidden ${
                          active
                            ? "ring-2 ring-[#8088E2] shadow-lg"
                            : "border-transparent hover:shadow-md"
                        }`}
                        style={{
                          background: active
                            ? "linear-gradient(to bottom, #C4C9FF, #E8EAFF)"
                            : "linear-gradient(to bottom, #D4D6FF, #EEF0FF)",
                        }}
                        variants={amountButtonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          {/* All amounts now use images instead of emojis */}
                          <motion.img
                            src={a.image}
                            alt={a.label}
                            className="w-6 h-6 sm:w-8 sm:h-8 mb-1 object-contain"
                            whileHover={{
                              scale: 1.2,
                              rotate: [0, -10, 10, 0],
                              transition: { duration: 0.3 }
                            }}
                          />
                          <div className="text-gray-900 text-sm sm:text-base font-semibold">
                            ${a.value}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>

                {/* Inputs */}
                <motion.div 
                  className="mt-8 space-y-3 sm:space-y-4 max-w-2xl mx-auto"
                  variants={formVariants}
                  initial="hidden"
                  animate={isFormInView ? "visible" : "hidden"}
                  transition={{ delay: 0.6 }}
                >
                  <motion.input
                    value={customAmount}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9.]/g, "");
                      setCustomAmount(v);
                      setSelectedAmount(null);
                    }}
                    inputMode="decimal"
                    placeholder="Custom Amount"
                    className="w-full h-12 rounded-xl border-2 border-[#8088E2] px-4 outline-none"
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                  
                  
                  <motion.input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Link your website or socials (optional)"
                    className="w-full h-12 rounded-xl border-2 border-[#8088E2] px-4 outline-none"
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                  <motion.label 
                    className="flex items-center justify-center gap-3 text-gray-600 select-none"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 accent-[#8088E2]"
                    />
                    <span>I want to donate anonymously</span>
                  </motion.label>
                </motion.div>

                {/* Success/Error Messages */}
                {(paymentSuccess || paymentError) && (
                  <motion.div 
                    className="mt-4 p-4 rounded-xl text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      backgroundColor: paymentSuccess ? '#f0f9ff' : '#fef2f2',
                      color: paymentSuccess ? '#0369a1' : '#dc2626'
                    }}
                  >
                    {paymentSuccess || paymentError}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.div 
                  className="mt-6 sm:mt-8 flex justify-center"
                  variants={formVariants}
                  initial="hidden"
                  animate={isFormInView ? "visible" : "hidden"}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    type="submit"
                    className="px-6 sm:px-8 h-11 rounded-xl bg-[#8088E2] text-white font-medium shadow-md hover:shadow-lg transition"
                    variants={submitButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Submit
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Additional floating decorative elements */}
      <motion.div 
        className="absolute z-0 pointer-events-none top-[120px] left-16 w-9 h-9 opacity-60 md:top-[150px] md:left-[310px] md:w-10 md:h-10"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "4s" }}
      >
        <img
          src={leave3}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div 
        className="absolute top-[120px] right-12 w-10 h-10 opacity-60 pointer-events-none z-0 md:top-[140px] md:right-[295px] md:w-16 md:h-16"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "6s" }}
      >
        <img
          src={leave4}
          alt="decorative"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={showPaymentModal}
        onClose={closePaymentModal}
        amount={customAmount ? Number(customAmount) : selectedAmount}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </motion.div>
  );
};

export default Donatehero;