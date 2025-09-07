import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            CIRAD Good Governance Advocacy Foundation ("we," "us," or "our") operates the Step Up Naija 
            platform ("the Platform"). This Privacy Policy explains how we collect, use, disclose, and 
            safeguard your information when you use our Platform.
          </p>
          <p>
            We are committed to protecting your privacy and ensuring transparency in our data practices, 
            especially given our mission to promote good governance and accountability in Nigeria.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <p>We may collect the following personal information:</p>
          <ul>
            <li><strong>Identity Information:</strong> Full name, date of birth, gender, nationality</li>
            <li><strong>Contact Information:</strong> Email address, phone number, postal address</li>
            <li><strong>Geographic Information:</strong> State, Local Government Area, ward details</li>
            <li><strong>Verification Documents:</strong> Government-issued ID, utility bills, photographs</li>
            <li><strong>Professional Information:</strong> Occupation, education, leadership experience</li>
          </ul>

          <h3>2.2 Platform Usage Data</h3>
          <ul>
            <li>Account activity and engagement patterns</li>
            <li>SUP token transactions and balances</li>
            <li>Civic activities completed and progress</li>
            <li>Forum posts and community interactions</li>
            <li>Voting patterns and project preferences</li>
          </ul>

          <h3>2.3 Technical Information</h3>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and operating system</li>
            <li>Page views and navigation patterns</li>
            <li>Session duration and frequency</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <h3>3.1 Platform Operations</h3>
          <ul>
            <li>Create and manage your account</li>
            <li>Process civic engagement activities</li>
            <li>Manage SUP token rewards and transactions</li>
            <li>Facilitate community interactions and networking</li>
            <li>Provide customer support and respond to inquiries</li>
          </ul>

          <h3>3.2 #13kCredibleChallenge</h3>
          <ul>
            <li>Verify eligibility and process nominations</li>
            <li>Conduct background checks for leadership positions</li>
            <li>Track progress across 774 Local Government Areas</li>
            <li>Generate reports and analytics for transparency</li>
            <li>Connect leaders with relevant opportunities</li>
          </ul>

          <h3>3.3 Communication</h3>
          <ul>
            <li>Send platform updates and notifications</li>
            <li>Share challenge progress and results</li>
            <li>Provide educational content and resources</li>
            <li>Send promotional materials (with consent)</li>
          </ul>

          <h2>4. Information Sharing and Disclosure</h2>
          <h3>4.1 Public Information</h3>
          <p>The following information may be made publicly available:</p>
          <ul>
            <li>Basic profile information of verified leaders</li>
            <li>Challenge progress statistics (aggregated)</li>
            <li>Community forum posts and contributions</li>
            <li>Project voting results and funding decisions</li>
          </ul>

          <h3>4.2 Third-Party Service Providers</h3>
          <p>We may share information with trusted service providers for:</p>
          <ul>
            <li>Identity verification and KYC services</li>
            <li>Payment processing and financial services</li>
            <li>Cloud hosting and data storage</li>
            <li>Analytics and performance monitoring</li>
            <li>Customer support and communication tools</li>
          </ul>

          <h3>4.3 Legal Requirements</h3>
          <p>We may disclose information when required by:</p>
          <ul>
            <li>Nigerian laws and regulations</li>
            <li>Court orders or government requests</li>
            <li>Law enforcement investigations</li>
            <li>Protection of rights, property, or safety</li>
          </ul>

          <h2>5. Data Security</h2>
          <h3>5.1 Security Measures</h3>
          <p>We implement comprehensive security measures including:</p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Multi-factor authentication options</li>
            <li>Regular security audits and assessments</li>
            <li>Access controls and employee training</li>
            <li>Incident response and breach notification procedures</li>
          </ul>

          <h3>5.2 Data Retention</h3>
          <p>
            We retain personal information for as long as necessary to fulfill the purposes outlined 
            in this Privacy Policy, unless a longer retention period is required by law. Account 
            information for the #13kCredibleChallenge may be retained longer for historical and 
            verification purposes.
          </p>

          <h2>6. Your Rights and Choices</h2>
          <h3>6.1 Access and Correction</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Request corrections to inaccurate data</li>
            <li>Update your profile and preferences</li>
            <li>Download your data in a portable format</li>
          </ul>

          <h3>6.2 Communication Preferences</h3>
          <ul>
            <li>Opt out of promotional emails</li>
            <li>Adjust notification settings</li>
            <li>Choose communication channels</li>
            <li>Control public profile visibility</li>
          </ul>

          <h3>6.3 Account Deletion</h3>
          <p>
            You may request account deletion at any time. Please note that some information may be 
            retained for legal compliance, fraud prevention, and historical challenge records.
          </p>

          <h2>7. Cookies and Tracking</h2>
          <h3>7.1 Cookie Usage</h3>
          <p>We use cookies and similar technologies for:</p>
          <ul>
            <li>Essential platform functionality</li>
            <li>Performance and analytics</li>
            <li>Personalization and user experience</li>
            <li>Security and fraud prevention</li>
          </ul>

          <h3>7.2 Cookie Management</h3>
          <p>
            You can control cookie settings through your browser preferences. Disabling certain 
            cookies may affect platform functionality.
          </p>

          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be processed and stored outside Nigeria by our service providers. 
            We ensure appropriate safeguards are in place to protect your data in accordance with 
            this Privacy Policy.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            The Platform is not intended for individuals under 18 years of age. We do not knowingly 
            collect personal information from children. If we become aware of such collection, we 
            will take steps to delete the information immediately.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes via email or platform notification. Your continued use of the Platform after 
            changes constitutes acceptance of the updated policy.
          </p>

          <h2>11. Nigerian Data Protection Compliance</h2>
          <p>
            We comply with the Nigeria Data Protection Regulation (NDPR) and other applicable Nigerian 
            privacy laws. This includes:
          </p>
          <ul>
            <li>Lawful basis for data processing</li>
            <li>Data subject rights protection</li>
            <li>Consent management and withdrawal</li>
            <li>Data breach notification procedures</li>
            <li>Regular compliance audits</li>
          </ul>

          <h2>12. Contact Information</h2>
          <p>
            For privacy-related questions, requests, or concerns, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> privacy@stepupnaija.org</li>
            <li><strong>Phone:</strong> +234 808 765 4321</li>
            <li><strong>Address:</strong> Data Protection Officer, CIRAD Foundation, Plot 123, Constitutional Avenue, CBD, Abuja, FCT</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-blue-800 mb-2">Transparency Commitment</h3>
            <p className="text-blue-700">
              As an organization promoting good governance, we believe in practicing what we preach. 
              This Privacy Policy reflects our commitment to transparency, accountability, and respect 
              for your privacy rights. We regularly review and update our practices to ensure they 
              meet the highest standards.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}