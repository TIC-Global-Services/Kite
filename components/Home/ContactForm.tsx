"use client";

import { useState } from "react";
import { FiSmile, FiPhone, FiMail } from "react-icons/fi";
import ContainerLayout from "../Layout/ContainerLayout";
import Image from "next/image";
import PrimaryButton from "../Reusable/PrimaryButton";
import { useToast } from "../Reusable/Toast";

// ── Validation ─────────────────────────────────────────────────────────────

const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = { name: string; phone: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim() || f.name.trim().length < 2)
    e.name = "Name must be at least 2 characters.";
  if (!f.phone.trim() || !PHONE_RE.test(f.phone))
    e.phone = "Enter a valid phone number.";
  if (!f.email.trim() || !EMAIL_RE.test(f.email))
    e.email = "Enter a valid email address.";
  if (!f.message.trim() || f.message.trim().length < 10)
    e.message = "Message must be at least 10 characters.";
  return e;
}

// ── Field sub-component ────────────────────────────────────────────────────

function FormField({
  label,
  placeholder,
  icon: Icon,
  type = "text",
  textarea = false,
  value,
  error,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  type?: string;
  textarea?: boolean;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const base =
    "w-full bg-transparent text-foreground/70 placeholder:text-foreground/40 font-ki md:text-lg outline-none resize-none border-b border-gray pb-2 pr-8 transition-colors focus:border-primary";

  return (
    <div className="space-y-2">
      <label className="block md:text-lg text-foreground tracking-tight">
        {label}
      </label>
      <div className="relative">
        {textarea ? (
          <textarea
            rows={2}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={base}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={base}
          />
        )}
        <Icon
          size={16}
          className="absolute right-0 top-1 text-foreground/30 pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-[11px] font-mono text-red-500 tracking-wide">{error}</p>
      )}
    </div>
  );
}

// ── ContactForm ─────────────────────────────────────────────────────────────

const EMPTY: Fields = { name: "", phone: "", email: "", message: "" };

export default function ContactForm() {
  const toast = useToast();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast("Please fix the errors before sending.", "error");
      return;
    }

    setLoading(true);
    try {
      // Replace with real API call
      await new Promise((r) => setTimeout(r, 1200));
      toast("Message sent! We'll be in touch soon.", "success");
      setFields(EMPTY);
      setErrors({});
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=" w-full">
      <ContainerLayout disablePaddingY className="border-x border-gray">
        
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* ── Left: header + form ── */}
          <div className="flex flex-col border-b md:border-b-0 border-x border-gray pt-14 md:py-20">

            {/* Dark header */}
            <div className="bg-primary text-background p-6 md:p-10 space-y-3 border-b border-gray">
              <h2 className=" text-4xl md:text-5xl text-background">Let's Talk</h2>
              <p className="font-ki text-background">
                Share a few details and we'll take it from there.
              </p>
            </div>

            {/* Form fields */}
            <div className=" p-6 md:p-10 space-y-8 flex-1 border-b border-gray">
              <FormField
                label="Your Name"
                placeholder="What's your good name?"
                icon={FiSmile}
                value={fields.name}
                error={errors.name}
                onChange={set("name")}
              />
              <FormField
                label="Your Phone Number"
                placeholder="Enter your phone number"
                icon={FiPhone}
                type="tel"
                value={fields.phone}
                error={errors.phone}
                onChange={set("phone")}
              />
              <FormField
                label="Your Email Address"
                placeholder="Enter your email address"
                icon={FiMail}
                type="email"
                value={fields.email}
                error={errors.email}
                onChange={set("email")}
              />
              <FormField
                label="Your Message"
                placeholder="Describe about your project"
                icon={FiSmile}
                textarea
                value={fields.message}
                error={errors.message}
                onChange={set("message")}
              />
            </div>
          </div>

          {/* ── Right: wave + privacy + button ── */}
          {/* Mobile: reversed → button first, desc, wave last. Desktop: wave, desc, button */}
          <div className="flex flex-col-reverse md:flex-col border-x  border-r border-gray pb-14 md:py-20 ">

            {/* GIF visual */}
            <div className="hidden md:block flex-1 relative overflow-hidden min-h-[280px] border-b border-t border-gray">
              <Image
                src="/assets/gif/loop4.gif"
                alt="Kite animation"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Privacy + submit — internally reversed on mobile: button first */}
            <div className=" p-6 md:p-10 flex flex-col md:flex-col items-start gap-6 border-b border-gray">
              <p className="font-ki text-foreground max-w-2xl text-sm md:text-base">
                We are committed to protecting your privacy. We will never
                collect information about you without your explicit consent.
              </p>
              <PrimaryButton
                onClick={handleSubmit}
                showIcon={false}
                disabled={loading}
                className="text-sm py-3 opacity-100 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Message"}
              </PrimaryButton>
            </div>
          </div>

        </div>
      </ContainerLayout>
    </section>
  );
}
