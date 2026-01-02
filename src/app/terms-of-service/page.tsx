import Header from "@/components/header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground px-6 pt-32 md:pt-40 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-4 text-4xl font-medium">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-6">
            <strong>Last updated:</strong> December 31, 2025
          </p>

          <div className="space-y-6 text-base leading-relaxed">
            <p>
              These Terms of Service ("Terms") govern your access to and use of
              SuperBox (the "Service"). By accessing or using the Service you
              agree to be bound by these Terms. If you do not agree, do not use
              the Service.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account, accessing, or using the Service, you
              represent and warrant that you are at least 13 years old and have
              the capacity to enter into these Terms.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              2. Account Registration and Security
            </h2>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Account Creation:</strong> Provide accurate, current,
                and complete information when registering.
              </li>
              <li>
                <strong>Account Security:</strong> You are responsible for
                maintaining account credentials and for all activity under your
                account.
              </li>
              <li>
                <strong>One Account:</strong> Maintain only one account unless
                otherwise authorized.
              </li>
            </ul>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              3. Use of the Service
            </h2>
            <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">
              3.1 Permitted Use
            </h3>
            <p>
              Use the Service lawfully and in accordance with these Terms.
              SuperBox provides tools for discovering, publishing, and running
              MCP servers in sandboxed environments.
            </p>
            <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">
              3.2 Prohibited Activities
            </h3>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Unauthorized access or interference with the Service or
                infrastructure.
              </li>
              <li>
                Uploading secrets, credentials, or malicious code to public
                registry entries.
              </li>
              <li>
                Reverse-engineering, scraping, or bulk-extracting data without
                permission.
              </li>
            </ul>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              4. Content and Intellectual Property
            </h2>
            <p>
              You retain ownership of content you upload. By submitting content
              you grant SuperBox a non-exclusive, worldwide license to host,
              display, and distribute the content as necessary to provide the
              Service. Do not upload content you do not have rights to.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              5. Payments, Billing & Refunds
            </h2>
            <p>
              Paid features, if any, are processed via third-party payment
              processors. Refunds follow our billing policy; contact{" "}
              <strong>support@superbox.ai</strong> for billing issues.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              6. Third‑Party Services
            </h2>
            <p>
              SuperBox integrates with third-party services (AWS, Firebase,
              payment providers). Use of those services is subject to their
              respective terms and policies.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              7. Disclaimers & Limitation of Liability
            </h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES. TO THE MAXIMUM
              EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SUPERBOX OR ITS
              CONTRIBUTORS BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
              DAMAGES.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              8. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless SuperBox from claims
              arising out of your use of the Service, violation of these Terms,
              or infringement of others' rights.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              9. Termination
            </h2>
            <p>
              We may suspend or terminate accounts that violate these Terms or
              threaten security. Upon termination, access stops and certain data
              may be retained as required by law.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              10. Modifications to Terms
            </h2>
            <p>
              We may update these Terms periodically. Continued use after
              changes constitutes acceptance. We will update the "Last updated"
              date when Terms change.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              11. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of India. Disputes will be
              resolved in courts located in India.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              12. Contact
            </h2>
            <p>
              Questions about these Terms: <strong>support@superbox.ai</strong>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
