import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  MessageCircle,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.png';

function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/subscriptions/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success('Successfully subscribed!');
        setEmail('');
      } else {
        toast.error(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again later.');
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="space-y-3">
      <div className="relative">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="h-11 pr-24 focus:border-[var(--color-teal-500)] focus:ring-[var(--color-teal-500)]"
          required
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading}
          className="absolute right-1 top-1 h-9 bg-[var(--color-teal-500)] hover:bg-[var(--color-teal-600)] text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-white text-gray-600 border-t border-gray-200">
      <div className="container max-w-screen-2xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="Agni" className="h-10 w-auto" />
              <span className="text-2xl font-semibold text-gray-900">
                Agni Online Store
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Your trusted destination for quality products at competitive
              prices. Shop with confidence.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-[var(--color-teal-500)] text-gray-600 hover:text-white bg-white hover:bg-[var(--color-teal-500)] flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-[var(--color-teal-500)] text-gray-600 hover:text-white bg-white hover:bg-[var(--color-teal-500)] flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/94725451111"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-[var(--color-teal-500)] text-gray-600 hover:text-white bg-white hover:bg-[var(--color-teal-500)] flex items-center justify-center transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-[var(--color-teal-500)] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-sm hover:text-[var(--color-teal-500)] transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="text-sm hover:text-[var(--color-teal-500)] transition-colors"
                >
                  Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-sm hover:text-[var(--color-teal-500)] transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-[var(--color-teal-500)] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[var(--color-teal-500)] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>Pinnaduwa</p>
                  <p>Galle, Sri Lanka</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[var(--color-teal-500)] flex-shrink-0" />
                <a
                  href="tel:+94725451111"
                  className="text-sm hover:text-[var(--color-teal-500)] transition-colors"
                >
                  +94 72 5451111
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[var(--color-teal-500)] flex-shrink-0" />
                <a
                  href="mailto:agnibookshop1@gmail.com"
                  className="text-sm hover:text-[var(--color-teal-500)] transition-colors break-all"
                >
                  agnibookshop1@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Subscribe to get updates on new products and exclusive offers.
            </p>
            <NewsletterSubscription />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Agni Online Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
