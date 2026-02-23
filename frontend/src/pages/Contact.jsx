import React, { useState, useContext } from "react";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Send,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { ThemeContext } from "../context/ThemeContext";




const EMAILJS_SERVICE_ID  = "service_re8eu6d";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_m9opscp";  // e.g. "template_xyz456"
const EMAILJS_PUBLIC_KEY  = "oemCsjgNh_Xm86odk";   // e.g. "AbCdEfGhIjKlMnOp"

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-[#d8cfb2] dark:border-gray-600 " +
  "bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 " +
  "focus:outline-none focus:ring-2 focus:ring-[#93a377] dark:focus:ring-scribe-sage transition";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  `${formData.firstName} ${formData.lastName}`.trim(),
          from_email: formData.email,
          subject:    formData.subject || "New message from Scribe contact form",
          message:    formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1dd] dark:bg-slate-900 text-[#1f2937] dark:text-white transition-colors duration-500">
      <Navbar />

      <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* ── LEFT ── */}
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight text-[#8d5a4a] dark:text-scribe-sage">
                Get in Touch
              </h1>

              <p className="mt-4 text-xl font-semibold text-[#5b463f] dark:text-gray-300">
                I'd love to hear from you!
              </p>

              <p className="mt-4 text-[#5b463f] dark:text-gray-400 leading-relaxed max-w-sm">
                Whether you have feedback, a question, or just want to say hello — drop us a message
                and we'll get back to you as soon as possible.
              </p>

              <div className="mt-10 flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-[#93a377] dark:text-scribe-sage shrink-0" />
                <span className="font-medium">surakshasharma303@gmail.com</span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <SocialIcon icon={<Facebook />}  label="Facebook" />
                <SocialIcon icon={<Instagram />} label="Instagram" />
                <SocialIcon icon={<Twitter />}   label="Twitter" />
                <SocialIcon icon={<Linkedin />}  label="LinkedIn" />
              </div>

              <div className="mt-14 hidden lg:block">
                <div className="w-64 h-64 rounded-full bg-[#93a377]/20 dark:bg-scribe-sage/10 blur-3xl" />
              </div>
            </div>

            {/* ── RIGHT FORM ── */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-2xl shadow-md p-8 border border-[#d8cfb2] dark:border-gray-600">
              <h2 className="text-2xl font-semibold mb-6 text-[#1f2937] dark:text-white">
                Send us a message
              </h2>

              {status === "success" && (
                <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">Message sent! We'll get back to you soon.</span>
                </div>
              )}
              {status === "error" && (
                <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">
                    Something went wrong. Please try again or email us directly.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName}
                      onChange={handleChange} required placeholder="Jane" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName}
                      onChange={handleChange} required placeholder="Doe" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input type="email" id="email" name="email" value={formData.email}
                    onChange={handleChange} required placeholder="your.email@example.com"
                    className={inputClass} />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input type="text" id="subject" name="subject" value={formData.subject}
                    onChange={handleChange} placeholder="What's this about?" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea id="message" name="message" value={formData.message}
                    onChange={handleChange} required rows={6}
                    placeholder="Write your message..."
                    className={`${inputClass} resize-none`} />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                    ${isSubmitting
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white"
                      : "bg-[#93a377] dark:bg-scribe-sage hover:bg-[#7f905f] dark:hover:bg-scribe-green text-white shadow-sm hover:shadow-md"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
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

const SocialIcon = ({ icon, label }) => (
  <button
    type="button"
    aria-label={label}
    className="w-10 h-10 rounded-full flex items-center justify-center
      bg-white/70 border border-[#d8cfb2] shadow-sm
      hover:bg-[#93a377] hover:border-[#93a377]
      dark:hover:bg-scribe-sage dark:hover:border-scribe-sage
      transition-all duration-200 group"
  >
    <span className="text-[#5b463f] dark:text-gray-300 group-hover:text-white transition-colors">
      {icon}
    </span>
  </button>
);

export default Contact;
