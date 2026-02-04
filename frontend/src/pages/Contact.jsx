import React, { useState, useContext } from "react";
import {
  Mail,
  Send,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { ThemeContext } from '../context/ThemeContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isDark } = useContext(ThemeContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Contact form submitted:", formData);

    setTimeout(() => {
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f6f1dd] dark:bg-slate-900 text-[#1f2937] dark:text-white transition-colors duration-500">
      <Navbar />

      <div className="pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* LEFT SIDE (like the reference image) */}
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight text-[#8d5a4a] dark:text-scribe-sage">
                Get in Touch
              </h1>

              <p className="mt-4 text-xl font-semibold text-[#5b463f] dark:text-gray-300">
                I'd like to hear from you!
              </p>


              {/* Email */}
              <div className="mt-10 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-[#93a377] dark:text-scribe-sage" />
                <span className="font-medium">surakshasharma303@gmail.com</span>
              </div>

              {/* Social icons (icons only for now - no links) */}
              <div className="mt-6 flex items-center gap-4">
                <SocialIcon icon={<Facebook />} />
                <SocialIcon icon={<Instagram />} />
                <SocialIcon icon={<Twitter />} />
                <SocialIcon icon={<Linkedin />} />
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-2xl shadow-md p-8 border border-[#d8cfb2] dark:border-gray-600">
              <h2 className="text-2xl font-semibold mb-6 text-[#1f2937] dark:text-white">
                Send us a message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First + Last name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-2"
                    >
                      First Name
                    </label>

                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#d8cfb2] dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-[#93a377] dark:focus:ring-scribe-sage transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-2"
                    >
                      Last Name
                    </label>

                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#d8cfb2] dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-[#93a377] dark:focus:ring-scribe-sage transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#d8cfb2] dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-[#93a377] dark:focus:ring-scribe-sage transition"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-[#d8cfb2] dark:border-gray-600 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-[#93a377] dark:focus:ring-scribe-sage transition resize-none"
                    placeholder="Write your message..."
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition 
                  ${
                    isSubmitting
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-[#93a377] dark:bg-scribe-sage hover:bg-[#7f905f] dark:hover:bg-scribe-green text-white"
                  }`}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ✅ Social icon component (icons only, no links for now) */
const SocialIcon = ({ icon }) => {
  return (
    <button
      type="button"
      className="w-10 h-10 rounded-full flex items-center justify-center
      bg-white/70 border border-[#d8cfb2] shadow-sm
      hover:bg-white transition"
      aria-label="social-icon"
    >
      <span className="text-[#5b463f] dark:text-gray-300">{icon}</span>
    </button>
  );
};

export default Contact;
