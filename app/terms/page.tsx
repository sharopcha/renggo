import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service - Renggo",
  description: "Terms of Service for Renggo waitlist and services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing our website and joining our waitlist, you agree to be bound by these Terms of Service and all
              applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
              using our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Waitlist Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Joining the Waitlist</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>You must provide a valid email address</li>
                  <li>You must be at least 18 years old or have parental consent</li>
                  <li>One email address per person</li>
                  <li>We reserve the right to remove users from the waitlist at our discretion</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Waitlist Benefits</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Early notification when Renggo launches</li>
                  <li>Potential early access opportunities</li>
                  <li>Exclusive updates on product development</li>
                  <li>Special pricing considerations (when applicable)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use of Website</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree to use our website only for lawful purposes and in accordance with these terms. You agree not
              to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Use the website in any way that violates applicable laws</li>
              <li>Transmit any harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Use automated systems to access the website without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including but not limited to text, graphics, logos, and software, is the
              property of Renggo and is protected by copyright and other intellectual property laws. You may not
              reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Privacy and Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimers</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Service Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Renggo is currently in development. We make no guarantees about launch dates, feature availability, or
                  service specifications. All information is subject to change.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Website Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to maintain website availability but do not guarantee uninterrupted access. We may
                  temporarily suspend access for maintenance or other reasons.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibred mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Renggo shall not be liable for any indirect, incidental, special,
              or consequential damages arising from your use of our website or services, even if we have been advised of
              the possibility of such damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to terminate or suspend your access to our website and remove you from our waitlist
              at any time, without prior notice, for conduct that we believe violates these terms or is harmful to other
              users or our business.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of material changes by
              posting the updated terms on this page and updating the &quot;Last updated&quot; date. Continued use of our services
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without
              regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">Email: legal@renggo.com</p>
              <p className="text-sm text-muted-foreground mt-2">
                We will respond to your inquiry within 5 business days.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
