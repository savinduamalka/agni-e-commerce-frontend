import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          message: ""
        });
        console.log("Form submitted successfully:", formData);
      } else {
        setSubmitStatus('error');
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">


        {/* Google Map Section */}
        <section className="w-full">
          <div className="h-80 w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d286.07516419834457!2d80.28748126503339!3d6.049790203268399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae16d6ef589344d%3A0x26fb49a562532b14!2sAgni%20BookShop%20%26%20Communication!5e1!3m2!1sen!2slk!4v1758170017742!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Agni BookShop & Communication Location"
            ></iframe>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              
              {/* Contact Form - Left Column */}
              <div>
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-black text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
                    <CardDescription className="text-white/90">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          name="contactNumber"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us how we can help you..."
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="min-h-32 resize-none"
                        />
                      </div>
                      
                      {/* Status Messages */}
                      {submitStatus === 'success' && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">
                            ✅ Message sent successfully! We'll get back to you soon.
                          </p>
                        </div>
                      )}
                      
                      {submitStatus === 'error' && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800 text-sm font-medium">
                            ❌ Failed to send message. Please try again or contact us directly.
                          </p>
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-12 bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all duration-300"
                      >
                        {isSubmitting ? "Sending Message..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information - Right Column */}
              <div className="space-y-8">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-black text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">Contact Agni</CardTitle>
                    <CardDescription className="text-white/90">
                      Visit us, call us, or reach out through any of these channels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    
                    {/* Phone */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone Number</h3>
                        <p className="text-gray-600">+94 72 5451111</p>
                        <p className="text-sm text-gray-500 mt-1">Call us for immediate assistance</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Store Address</h3>
                        <p className="text-gray-600">Pinnaduwa</p>
                        <p className="text-gray-600">Galle, Sri Lanka</p>
                        <p className="text-sm text-gray-500 mt-1">Visit our physical store</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Address</h3>
                        <p className="text-gray-600">agnibookshop1@gmail.com</p>
                        <p className="text-sm text-gray-500 mt-1">Email us anytime</p>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h3>
                        <div className="space-y-1">
                          <p className="text-gray-600">Monday - Friday: 7:00 AM - 9:00 PM</p>
                          <p className="text-gray-600">Saturday: 8:00 AM - 9:00 PM</p>
                          <p className="text-gray-600">Sunday: 9:00 AM - 9:00 PM</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">We're here when you need us</p>
                      </div>
                    </div>

                  </CardContent>
                </Card>

                {/* Additional Info Card */}
                <Card className="shadow-lg border-0 bg-gray-50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Agni Store?</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                        Premium quality products at competitive prices
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                        Fast and reliable delivery across Sri Lanka
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                        24/7 customer support for all your needs
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                        Easy returns and exchanges policy
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
