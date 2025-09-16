import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, X, AlertCircle } from "lucide-react";
import leave1 from "../assets/images/leave1.png";
import leave2 from "../assets/images/leave2.png";
import leave3 from "../assets/images/leave3.png";
import leave4 from "../assets/images/leave4.png";

const Contacthero = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

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
      filter: "blur(10px)",
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
      scale: 0.95,
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
      scale: isSubmitting ? 1 : 1.02,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: isSubmitting ? 1 : 0.98,
    },
  };

  const arrowVariants = {
    hover: {
      x: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4000); // Auto hide after 4 seconds
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showAlert("success", "Your message has been sent successfully!");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        showAlert(
          "error",
          data.error || "Failed to send message. Please try again."
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
      showAlert(
        "error",
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-darkbg relative overflow-hidden flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Full Screen Loader */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#8088E2] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                  Sending Message
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Please wait while we process your request...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Alert */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            className="fixed inset-x-0 top-6 z-50 flex justify-center px-4"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`w-full max-w-md p-4 rounded-xl shadow-lg border-l-4 ${
                alert.type === "success"
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {alert.type === "success" ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`font-medium ${
                        alert.type === "success"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {alert.type === "success" ? "Success!" : "Error!"}
                    </h4>
                    <p
                      className={`text-sm ${
                        alert.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setAlert({ show: false, type: "", message: "" })
                  }
                  className={`p-1 rounded-full hover:bg-opacity-20 flex-shrink-0 ml-2 ${
                    alert.type === "success"
                      ? "hover:bg-green-500"
                      : "hover:bg-red-500"
                  }`}
                >
                  <X
                    className={`w-4 h-4 ${
                      alert.type === "success"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated floating elements - decorative shapes */}
      <motion.div
        className="absolute z-0 pointer-events-none top-4 left-5 w-14 h-14 opacity-70 md:top-[20px] md:left-[200px] md:w-20 md:h-24"
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
        className="absolute z-0 pointer-events-none top-6 right-5 w-10 h-10 opacity-70 md:top-[40px] md:right-[215px] md:w-16 md:h-12"
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
          className="text-5xl mt-14 md:text-6xl lg:text-6xl font-bold text-white mb-4 leading-[1.1] md:leading-tight max-w-[25ch] mx-auto"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          Contact Us
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-xl md:text-xl text-[#b7b7b7] mb-12 max-w-2xl mx-auto"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
        >
          "Have questions, feedback, or need support? Fill the form below and
          we'll get back to you as soon as possible."
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
              transition: { duration: 0.3 },
            }}
          >
            <div className="bg-white rounded-[26px] overflow-hidden">
              <form
                onSubmit={onSubmit}
                className="px-4 sm:px-6 md:px-10 py-8 sm:py-10"
              >
                <motion.div
                  className="text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3 className="text-gray-900 text-xl font-bold">
                    Send Us a Message
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Got a question? Fill out the form, and we'll get back to
                    you shortly!
                  </p>
                </motion.div>

                {/* Inputs */}
                <motion.div
                  className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <motion.div
                    className="flex flex-col gap-1"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="text-sm text-start text-gray-600">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      value={form.name}
                      onChange={(e) => onChange("name", e.target.value)}
                      placeholder="Carlo Castillo"
                      className="w-full h-12 mt-1 rounded-xl border-2 border-[#8088e2] px-4 outline-none"
                      required
                      disabled={isSubmitting}
                      variants={inputVariants}
                      whileFocus="focus"
                    />
                  </motion.div>
                  <motion.div
                    className="flex flex-col gap-1"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="text-sm text-start text-gray-600 ">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      type="email"
                      value={form.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      placeholder="alma.lawson@example.com"
                      className="w-full mt-1 h-12 rounded-xl border-2 border-[#8088e2] px-4 outline-none"
                      required
                      disabled={isSubmitting}
                      variants={inputVariants}
                      whileFocus="focus"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="mt-4 text-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <label className="text-sm text-gray-600">
                    Phone<span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    placeholder="(+880) 1680-6381-89"
                    className="w-full mt-2 h-12 rounded-xl border-2 border-[#8088e2] px-4 outline-none"
                    required
                    disabled={isSubmitting}
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                </motion.div>

                <motion.div
                  className="mt-4 text-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <label className="text-sm text-gray-600">Cover Letter</label>
                  <motion.textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => onChange("message", e.target.value)}
                    placeholder="Write about your self.."
                    className="w-full mt-2 rounded-xl border-2 border-[#8088e2] px-4 py-2 outline-none resize-none"
                    disabled={isSubmitting}
                    variants={inputVariants}
                    whileFocus="focus"
                  />
                </motion.div>

                {/* Submit */}
                <motion.div
                  className="mt-6 sm:mt-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-[#8088E2] text-white font-medium shadow-md hover:shadow-lg transition ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    variants={submitButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.div variants={arrowVariants} whileHover="hover">
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                    Send Message
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

export default Contacthero;
