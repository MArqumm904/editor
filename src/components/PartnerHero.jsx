import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import leave1 from "../assets/images/leave1.png";
import leave2 from "../assets/images/leave2.png";
import leave3 from "../assets/images/leave3.png";
import leave4 from "../assets/images/leave4.png";

const PartnerHero = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [desiredFee, setDesiredFee] = useState("");
  const [paypalLink, setPaypalLink] = useState("");
  const [email, setEmail] = useState("");
  const [ownsRights, setOwnsRights] = useState(false);

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

  const uploadButtonVariants = {
    hover: {
      scale: 1.1,
      rotate: 90,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.9,
    },
  };

  const previewVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      filter: "blur(5px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#8088E2",
      boxShadow: "0 0 0 3px rgba(128, 136, 226, 0.1)",
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

  const onPickFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Basic client-side checks
    if (!file) {
      alert("Please upload a .webM file.");
      return;
    }
    if (!ownsRights) {
      alert("Please confirm that you own all rights.");
      return;
    }
    console.log({ desiredFee, paypalLink, email, fileName: file?.name });
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
          Partner With Us!
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          className="text-xl md:text-xl text-[#b7b7b7] mb-12 max-w-2xl mx-auto"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
        >
          Submit to sell your .webM animation
        </motion.p>

        {/* Form container */}
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
                {/* Uploader */}
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={onPickFile}
                    className="w-16 h-16 md:w-14 md:h-14 rounded-xl border-2 border-[#8088E2] bg-white shadow-sm grid place-items-center"
                    variants={uploadButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Plus className="w-8 h-8 text-[#8088E2]" />
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/webm,.webm"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <motion.p 
                    className="text-gray-700 mt-4 text-base"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    Upload a .webM file (animated overlay with alpha channel)
                  </motion.p>
                </motion.div>

                {/* Preview */}
                <motion.div 
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <motion.div 
                    className="w-[330px] h-[180px] sm:w-[300px] sm:h-[170px] bg-[#eef0ff] border-2 border-[#c6caff] rounded-xl grid place-items-center overflow-hidden"
                    whileHover={{
                      scale: 1.02,
                      borderColor: "#8088E2",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {previewUrl ? (
                      <motion.video 
                        src={previewUrl} 
                        controls 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-contain bg-transparent"
                        variants={previewVariants}
                        initial="hidden"
                        animate="visible"
                      />
                    ) : (
                      <motion.span 
                        className="text-[#8088E2] text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                      >
                        No preview
                      </motion.span>
                    )}
                  </motion.div>
                </motion.div>

                {/* Inputs */}
                <motion.div 
                  className="mt-8 space-y-3 sm:space-y-4 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.input
                    value={desiredFee}
                    onChange={(e) => setDesiredFee(e.target.value.replace(/[^0-9.]/g, ""))}
                    inputMode="decimal"
                    placeholder="Desired Fee Input"
                    className="w-full h-12 rounded-xl border-2 border-[#8088E2] px-4 outline-none"
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                  <motion.input
                    value={paypalLink}
                    onChange={(e) => setPaypalLink(e.target.value)}
                    placeholder="PayPal.me Link"
                    className="w-full h-12 rounded-xl border-2 border-[#8088E2] px-4 outline-none"
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                  <motion.input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
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
                      checked={ownsRights}
                      onChange={(e) => setOwnsRights(e.target.checked)}
                      className="h-4 w-4 accent-[#8088E2]"
                    />
                    <span>You agree that you own all rights..</span>
                  </motion.label>
                </motion.div>

                {/* Submit */}
                <motion.div 
                  className="mt-6 sm:mt-8 flex justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
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
    </motion.div>
  );
};

export default PartnerHero;