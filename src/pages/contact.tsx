import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function ContactPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              data-testid="button-back"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about Step Up Naija or the #13kCredibleChallenge? We're here to help! 
            Reach out to us and join the movement for a better Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-green-600" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">General Inquiries:</p>
                <a href="mailto:info@stepupnaija.org" className="text-green-600 hover:text-green-700 font-medium">
                  info@stepupnaija.org
                </a>
                <p className="text-gray-600 mt-4 mb-2">Challenge Support:</p>
                <a href="mailto:challenge@stepupnaija.org" className="text-green-600 hover:text-green-700 font-medium">
                  challenge@stepupnaija.org
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-600" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">WhatsApp Support:</p>
                <a href="tel:+2348012345678" className="text-green-600 hover:text-green-700 font-medium">
                  +234 801 234 5678
                </a>
                <p className="text-gray-600 mt-4 mb-2">Office Line:</p>
                <a href="tel:+2348087654321" className="text-green-600 hover:text-green-700 font-medium">
                  +234 808 765 4321
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Visit Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 font-medium">CIRAD Foundation</p>
                <p className="text-gray-600">
                  Plot 123, Constitutional Avenue<br />
                  Central Business District<br />
                  Abuja, FCT, Nigeria
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 5:00 PM<br />
                  Saturday: 10:00 AM - 2:00 PM<br />
                  Sunday: Closed
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  *Online support available 24/7
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Enter your first name"
                        data-testid="input-firstName"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Enter your last name"
                        data-testid="input-lastName"
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email address"
                      data-testid="input-email"
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="Enter your phone number"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lga">Local Government Area</Label>
                    <Input 
                      id="lga" 
                      placeholder="Which LGA are you from?"
                      data-testid="input-lga"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject" 
                      placeholder="What is this about?"
                      data-testid="input-subject"
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      data-testid="textarea-message"
                      required 
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="newsletter" className="rounded" />
                    <Label htmlFor="newsletter" className="text-sm text-gray-600">
                      I'd like to receive updates about the #13kCredibleChallenge and Step Up Naija initiatives
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    data-testid="button-submit"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Looking for quick answers? Check out our frequently asked questions.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setLocation("/faq")}
            data-testid="button-faq"
          >
            View FAQ
          </Button>
        </div>
      </div>

    </div>
  );
}