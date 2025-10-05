import { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  User,
  AtSign,
  PhoneCall,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { toast } from 'sonner';

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    title: 'Call us',
    description: 'Daily from 7.00 AM - 9.00 PM',
    value: '+94 72 5451111',
    href: 'tel:+94725451111',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'We respond within one business day',
    value: 'agnibookshop1@gmail.com',
    href: 'mailto:agnibookshop1@gmail.com',
  },
  {
    icon: MapPin,
    title: 'Visit us',
    description: 'Agni BookShop & Communication, Pinnaduwa, Galle',
    value: 'View on maps',
    href: 'https://maps.app.goo.gl/1QWQyHgYt7ku6uzp9',
  },
];

const BUSINESS_HOURS = [
  { day: 'Monday – Friday', time: '7:00 AM – 9:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 9:00 PM' },
  { day: 'Sunday', time: '9:00 AM – 9:00 PM' },
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/contact/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Message sent. We'll get back to you shortly.");
        setFormData({ name: '', email: '', contactNumber: '', message: '' });
      } else {
        toast.error("We couldn't send your message. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d286.07516419834457!2d80.28748126503339!3d6.049790203268399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae16d6ef589344d%3A0x26fb49a562532b14!2sAgni%20BookShop%20%26%20Communication!5e1!3m2!1sen!2slk!4v1758170017742!5m2!1sen!2slk"
                title="Agni BookShop & Communication location"
                className="h-[320px] w-full border-0 sm:h-[420px]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr]">
              <div className="space-y-12">
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-semibold">
                    Visit, call, or write
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg">
                    We reply to every message and aim to respond within a single
                    business day.
                  </p>
                </div>

                <div className="space-y-6">
                  {CONTACT_CHANNELS.map(
                    ({ icon: Icon, title, description, value, href }) => (
                      <div key={title} className="flex items-start gap-4">
                        <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-[var(--color-teal-500)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            {title}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              className="text-lg font-medium text-gray-900 underline-offset-4 hover:text-[var(--color-teal-500)] hover:underline"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="text-lg font-medium text-gray-900">
                              {value}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">{description}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[var(--color-teal-500)]" />
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Business hours
                    </h3>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm text-gray-600">
                    {BUSINESS_HOURS.map(({ day, time }) => (
                      <div key={day} className="flex justify-between">
                        <dt>{day}</dt>
                        <dd className="font-medium text-gray-900">{time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <User className="h-4 w-4 text-[var(--color-teal-500)]" />
                        Full name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-11 border-gray-300 focus:border-[var(--color-teal-500)] focus:ring-[var(--color-teal-500)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <AtSign className="h-4 w-4 text-[var(--color-teal-500)]" />
                        Email address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-11 border-gray-300 focus:border-[var(--color-teal-500)] focus:ring-[var(--color-teal-500)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="contactNumber"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <PhoneCall className="h-4 w-4 text-[var(--color-teal-500)]" />
                        Contact number
                      </Label>
                      <Input
                        id="contactNumber"
                        name="contactNumber"
                        type="tel"
                        placeholder="+94 77 123 4567"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="h-11 border-gray-300 focus:border-[var(--color-teal-500)] focus:ring-[var(--color-teal-500)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4 text-[var(--color-teal-500)]" />
                        Your message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us how we can help."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="min-h-[9rem] resize-none border-gray-300 focus:border-[var(--color-teal-500)] focus:ring-[var(--color-teal-500)]"
                      />
                      <p className="text-xs text-gray-500">
                        We typically respond within a day.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[var(--color-teal-500)] hover:bg-[var(--color-teal-600)] text-white font-medium"
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Send className="h-4 w-4" />
                            Send message
                          </span>
                        )}
                      </Button>
                      <p className="text-xs text-center text-gray-500">
                        We only use your details to follow up on this request.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Prefer to talk things through?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Call us during opening hours or email anytime. We keep support
              simple, personal, and quick.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-[var(--color-teal-500)] hover:bg-[var(--color-teal-600)] text-white"
              >
                <a href="tel:+94725451111" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Call +94 72 5451111</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 text-gray-900 hover:bg-white"
              >
                <a
                  href="mailto:agnibookshop1@gmail.com"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email us</span>
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
