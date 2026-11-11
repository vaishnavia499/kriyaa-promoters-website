import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KriyaaLogo } from '../../components/KriyaaLogo';
import { PublicFooter } from '../../components/public/PublicFooter';
import { PublicTab } from '../../types';

interface PublicContactProps {
  onTabChange: (tab: PublicTab) => void;
  onOpenConsultation: () => void;
  onOpenCabBooking: () => void;
  onBack?: () => void;
}

export const PublicContact: React.FC<PublicContactProps> = ({
  onTabChange,
  onOpenConsultation,
  onOpenCabBooking,
  onBack,
}) => {
  const { showToast, saveLead } = useApp();

  // Interactive Email Form State
  const [fullName, setFullName] = useState('');
  const [whatsappMobile, setWhatsappMobile] = useState('');
  const [subject, setSubject] = useState('DTCP Plot Inquiry & Site Visit');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsappMobile.trim() || !message.trim()) {
      showToast('Please fill all required contact fields', 'error');
      return;
    }

    setIsSending(true);

    // Save inquiry to Leads
    saveLead({
      customerName: fullName.trim(),
      phone: whatsappMobile.trim(),
      propertyOfInterest: subject || 'Contact Page Email Inquiry',
      preferredAction: 'Callback',
      status: 'New',
      notes: [`Inquiry Form: "${message}"`],
    });

    // Formulate pre-filled email intent
    const recipient = 'rajesh@kriyaapromoters.com';
    const emailSubject = encodeURIComponent(`[Kriyaa Promoters Inquiry] ${subject} - ${fullName}`);
    const emailBody = encodeURIComponent(
      `Hello Rajesh RTR,\n\n` +
      `You have received a new verified customer inquiry from the Kriyaa Promoters website:\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Customer Name: ${fullName}\n` +
      `• WhatsApp Mobile: ${whatsappMobile}\n` +
      `• Subject: ${subject}\n` +
      `• Date: ${new Date().toLocaleDateString('en-IN')}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Message:\n${message}\n\n` +
      `Sent via Kriyaa Promoters Client Portal.`
    );

    const mailtoUrl = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

    setTimeout(() => {
      setIsSending(false);
      showToast('Opening your email client to send inquiry!', 'success');
      window.location.href = mailtoUrl;
    }, 400);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#17251E] flex flex-col justify-between select-none">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full space-y-8 sm:space-y-10">
        {/* Page Title with optional Back button */}
        <div className="flex items-center justify-between max-w-2xl mx-auto pt-2 gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[42px] min-w-[42px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs group shrink-0"
              title="Back to Previous Page"
              aria-label="Back to Previous Page"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform text-[#0B3B24]" />
            </button>
          )}
          <div className="text-center flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#113B24] text-xs font-black uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-[#CA8A04]" />
              <span>Connect Directly with Promoter</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
              Contact Kriyaa Promoters
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Reach out directly to Managing Director <span className="font-bold text-slate-900">Rajesh RTR</span>. Whether you wish to review DTCP documents or schedule an on-site consultation, we are here to help.
            </p>
          </div>
          {onBack && <div className="w-[42px] shrink-0 hidden sm:block" />}
        </div>

        {/* 2-Column Grid: Contact Info vs Automated Email Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Column 1: Promoter Contact Details & Office (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Promoter Card */}
            <div className="bg-[#113B24] rounded-3xl p-6 text-white border border-[#1E5D32] shadow-xl space-y-5">
              <div className="flex items-center gap-4">
                {/* Circle Framed Logo replacing bare text 'RR' */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-[#EAB308] p-1.5 flex items-center justify-center shadow-md overflow-hidden">
                    <KriyaaLogo className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#EAB308] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-900 shadow-xs flex items-center gap-0.5">
                    <span>MD</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">Rajesh RTR</h3>
                  <p className="text-xs font-bold text-[#EAB308]">Managing Director &amp; Promoter</p>
                  <p className="text-[11px] text-emerald-200 mt-0.5">Kriyaa Promoters · 12+ Years Trust</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs border-t border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#EAB308] shrink-0">
                    <Phone className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block">Direct Mobile / WhatsApp</span>
                    <a href="tel:+919443278899" className="text-white font-black hover:text-[#EAB308] text-sm">
                      +91 94432 78899 / +91 94432 75727
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#EAB308] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block">Official Business Email</span>
                    <a href="mailto:rajesh@kriyaapromoters.com" className="text-white font-bold hover:text-[#EAB308]">
                      rajesh@kriyaapromoters.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#EAB308] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block">Registered Office</span>
                    <p className="text-slate-200 font-semibold leading-relaxed">
                      No. 7, Kamaraj Salai, Cuddalore, Tamil Nadu 607001 (Opposite Town Hall)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#EAB308] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block">Consultation Support Hours</span>
                    <span className="text-white font-semibold">
                      Monday to Sunday · 8:00 AM – 8:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919443278899?text=Hello%20Rajesh%20RTR,%20I%20am%20contacting%20you%20from%20the%20Kriyaa%20Promoters%20website."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full min-h-[46px] rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp (+91 94432 78899)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Email Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-black text-[#CA8A04] uppercase tracking-wider block">
                  Direct Promoter Inquiry
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Send Message to Rajesh RTR
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in your details below to send your plot inquiry or site visit request directly to Managing Director Rajesh RTR.
                </p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                {/* Field 1: Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Full Name <span className="text-[#991B1B]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. S. Murugan"
                      className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                    />
                  </div>
                </div>

                {/* Field 2: WhatsApp Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    WhatsApp Mobile Number <span className="text-[#991B1B]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={whatsappMobile}
                      onChange={(e) => setWhatsappMobile(e.target.value)}
                      placeholder="e.g. +91 94432 78899"
                      className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                    />
                  </div>
                </div>

                {/* Field 3: Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Subject <span className="text-[#991B1B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Golden City Plot #42 Inquiry"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                  />
                </div>

                {/* Field 4: Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Your Message / Requirements <span className="text-[#991B1B]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your plot preferences, budget, or preferred visit date..."
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                  />
                </div>

                {/* Submit Action: Clean, Professional Button */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] hover:brightness-110 active:scale-98 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/15 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Sending Your Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                        <span>Send Message to Rajesh RTR</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    Inquiries are sent directly to <strong className="text-slate-700">rajesh@kriyaapromoters.com</strong> and logged to our promoter desk.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Full company footer at base */}
      <PublicFooter
        onTabChange={onTabChange}
        onOpenConsultation={onOpenConsultation}
      />
    </div>
  );
};
