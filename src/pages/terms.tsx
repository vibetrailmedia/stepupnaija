import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using Step Up Naija platform ("the Platform"), operated by CIRAD Good Governance 
            Advocacy Foundation ("we," "us," or "our"), you agree to be bound by these Terms of Service 
            ("Terms"). If you disagree with any part of these terms, you may not access the Platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Step Up Naija is a civic engagement platform that facilitates the #13kCredibleChallenge, 
            a nationwide initiative to identify, train, and organize 13,000 credible Nigerian leaders 
            across all 774 Local Government Areas. The Platform includes:
          </p>
          <ul>
            <li>Civic engagement activities and tasks</li>
            <li>SUP token economy and reward system</li>
            <li>Community forums and networking features</li>
            <li>Project voting and funding mechanisms</li>
            <li>Progress tracking and transparency tools</li>
          </ul>

          <h2>3. User Accounts and Eligibility</h2>
          <h3>3.1 Account Registration</h3>
          <p>
            To use certain features of the Platform, you must register for an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and update your account information</li>
            <li>Keep your account credentials secure and confidential</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3>3.2 Eligibility Requirements</h3>
          <p>You must be:</p>
          <ul>
            <li>At least 18 years old</li>
            <li>A Nigerian citizen or resident</li>
            <li>Legally capable of entering into binding agreements</li>
          </ul>

          <h2>4. SUP Token System</h2>
          <h3>4.1 Token Economy</h3>
          <p>
            SUP tokens are digital rewards earned through civic engagement activities on the Platform. 
            The current exchange rate is 1 SUP = ₦10, subject to change with notice.
          </p>

          <h3>4.2 Earning and Using Tokens</h3>
          <ul>
            <li>Tokens are earned by completing verified civic activities</li>
            <li>Tokens can be used to enter prize draws and vote on community projects</li>
            <li>Tokens have no monetary value outside the Platform</li>
            <li>We reserve the right to adjust token values and rewards</li>
          </ul>

          <h2>5. #13kCredibleChallenge Participation</h2>
          <h3>5.1 Challenge Rules</h3>
          <p>
            Participation in the #13kCredibleChallenge is voluntary and subject to specific guidelines:
          </p>
          <ul>
            <li>Participants must complete KYC verification</li>
            <li>All nominations and activities must be truthful and verifiable</li>
            <li>Leaders must meet credibility criteria as defined by the Platform</li>
            <li>Geographic distribution across 774 LGAs will be maintained</li>
          </ul>

          <h2>6. User Conduct and Content</h2>
          <h3>6.1 Prohibited Activities</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Platform for any unlawful purpose</li>
            <li>Harass, threaten, or intimidate other users</li>
            <li>Post false, misleading, or defamatory content</li>
            <li>Attempt to manipulate token earnings or challenge results</li>
            <li>Interfere with Platform security or functionality</li>
            <li>Create multiple accounts to gain unfair advantages</li>
          </ul>

          <h3>6.2 Content Standards</h3>
          <p>All user-generated content must:</p>
          <ul>
            <li>Comply with Nigerian laws and regulations</li>
            <li>Respect the rights and dignity of others</li>
            <li>Be relevant to civic engagement and leadership</li>
            <li>Not contain spam, commercial solicitation, or inappropriate material</li>
          </ul>

          <h2>7. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Our collection and use of personal information is governed 
            by our Privacy Policy, which forms part of these Terms. By using the Platform, you consent 
            to data collection and use as outlined in our Privacy Policy.
          </p>

          <h2>8. KYC and Verification</h2>
          <p>
            To participate in certain activities and access full Platform features, you may be required 
            to complete Know Your Customer (KYC) verification. This may include providing:
          </p>
          <ul>
            <li>Government-issued identification</li>
            <li>Proof of address</li>
            <li>Phone number verification</li>
            <li>Additional documentation as required</li>
          </ul>

          <h2>9. Intellectual Property</h2>
          <h3>9.1 Platform Content</h3>
          <p>
            The Platform and its content, features, and functionality are owned by CIRAD Foundation 
            and are protected by Nigerian and international copyright, trademark, and other laws.
          </p>

          <h3>9.2 User Content</h3>
          <p>
            By posting content on the Platform, you grant us a non-exclusive, royalty-free license 
            to use, modify, and display such content for Platform operations and promotional purposes.
          </p>

          <h2>10. Platform Availability and Modifications</h2>
          <p>
            We reserve the right to:
          </p>
          <ul>
            <li>Modify or discontinue Platform features with notice</li>
            <li>Perform maintenance that may temporarily affect availability</li>
            <li>Update these Terms as necessary for legal compliance or Platform improvements</li>
          </ul>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, CIRAD Foundation shall not be liable for any 
            indirect, incidental, special, consequential, or punitive damages resulting from your 
            use of the Platform.
          </p>

          <h2>12. Termination</h2>
          <h3>12.1 Termination by User</h3>
          <p>You may terminate your account at any time by contacting support.</p>

          <h3>12.2 Termination by Us</h3>
          <p>
            We may suspend or terminate your account if you violate these Terms, engage in fraudulent 
            activity, or for any reason that may harm the Platform or other users.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes 
            arising from these Terms or your use of the Platform shall be resolved in Nigerian courts.
          </p>

          <h2>14. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at:
          </p>
          <ul>
            <li>Email: legal@stepupnaija.org</li>
            <li>Phone: +234 808 765 4321</li>
            <li>Address: CIRAD Foundation, Plot 123, Constitutional Avenue, CBD, Abuja, FCT</li>
          </ul>

          <h2>15. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any 
            material changes via email or Platform notification. Continued use of the Platform 
            after changes constitutes acceptance of the new Terms.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-green-800 mb-2">Questions?</h3>
            <p className="text-green-700">
              If you have any questions about these Terms of Service, please don't hesitate to 
              contact our support team. We're here to help ensure your experience with Step Up Naija 
              is positive and transparent.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}