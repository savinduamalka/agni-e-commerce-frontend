import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

// Newsletter Subscription Component
function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
        setMessage(''); 
      } else {
        setMessage(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubscribe} className="flex mb-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="rounded-r-none"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="rounded-l-none" 
          disabled={isLoading}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {message && (
        <p className="text-sm text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logo} alt="Agni Store" className="h-30 w-auto mr-2" />
              <h3 className="text-xl font-bold">Agni Online Store</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Your trusted partner for electronics shopping needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">+94 72 5451111</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center mt-0.5">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Pinnaduwa</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Galle, Sri Lanka</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">agnibookshop1@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest deals.
            </p>
            <NewsletterSubscription />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Agni Online Store. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
