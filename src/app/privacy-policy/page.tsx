import Header from "@/components/header";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground px-6 pt-32 md:pt-40 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-4 text-4xl font-medium">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">
            <strong>Last updated:</strong> December 31, 2025
          </p>

          <div className="space-y-6 text-base leading-relaxed">
            <p>
              SuperBox ("we", "us", "our") operates the SuperBox platform,
              including the website, CLI, backend APIs, and sandboxed MCP
              execution services. This Privacy Policy explains how we collect,
              use, disclose, and safeguard personal information when you use our
              Services.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              1. Information We Collect
            </h2>
            <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">
              1.1 Information You Provide
            </h3>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Account Information:</strong> name, email, username,
                profile data when you register or authenticate (we support
                providers like Firebase).
              </li>
              <li>
                <strong>Server & Repository Metadata:</strong> MCP metadata you
                publish or push (repository URL, entrypoint, tools, security
                reports).
              </li>
              <li>
                <strong>User Content:</strong> chat transcripts, submitted
                files, configurations, and other content you upload or create
                while using the Services.
              </li>
            </ul>

            <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">
              1.2 Automatically Collected Information
            </h3>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Usage Data:</strong> API requests, CLI command usage,
                search queries, and feature usage.
              </li>
              <li>
                <strong>Execution & Logs:</strong> Lambda / CloudWatch logs,
                tool execution metadata, and runtime diagnostics generated when
                MCPs run in our sandbox environment.
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, device and browser
                information, session identifiers, and cookies.
              </li>
            </ul>

            <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">
              1.3 Third‑Party Sources
            </h3>
            <p>
              We may receive information from third-party services you connect
              (e.g., OAuth providers, code hosts) or from public registries used
              by the platform.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              2. How We Use Information
            </h2>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Provide, operate, and maintain the Service (including sandboxed
                MCP execution).
              </li>
              <li>
                Authenticate users, manage accounts, and process payments (via
                payment processors).
              </li>
              <li>
                Run security scans (SonarCloud, Bandit), generate reports, and
                support the publish/push workflow.
              </li>
              <li>
                Monitor and improve platform performance, detect abuse, and
                secure the infrastructure.
              </li>
              <li>
                Communicate service updates, support responses, and legal
                notices.
              </li>
            </ul>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              3. Third‑Party Services
            </h2>
            <p className="mb-2">
              We use trusted third-party services to operate parts of the
              platform. These include but are not limited to:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>AWS:</strong> S3 for registry storage, API Gateway &
                Lambda for sandboxed execution, CloudWatch for logs.
              </li>
              <li>
                <strong>Firebase / Google:</strong> Authentication and optional
                analytics.
              </li>
              <li>
                <strong>Payment Processors:</strong> Third-party providers
                process payments; we do not store full card numbers.
              </li>
              <li>
                <strong>Analytics & Monitoring:</strong> Optional analytics and
                performance providers.
              </li>
            </ul>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              4. Sharing & Disclosure
            </h2>
            <p className="mb-2">
              We do not sell personal data. We may share information in the
              following limited scenarios:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Service Providers:</strong> vendors who perform services
                on our behalf (hosting, analytics, payments).
              </li>
              <li>
                <strong>Legal Requirements:</strong> when required by law, to
                respond to legal processes, or to protect rights and safety.
              </li>
              <li>
                <strong>Security & Abuse:</strong> to investigate and prevent
                abuse, fraud, or security incidents.
              </li>
            </ul>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              5. Your Rights & Choices
            </h2>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Access & Correction:</strong> You can view and update
                profile information through account settings.
              </li>
              <li>
                <strong>Data Deletion:</strong> You may delete your account to
                remove personal data (some system logs may persist for legal or
                operational purposes).
              </li>
              <li>
                <strong>Data Portability:</strong> You may request an export of
                your data.
              </li>
              <li>
                <strong>Cookies:</strong> Manage cookie preferences through your
                browser or our cookie controls where provided.
              </li>
            </ul>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              6. Data Retention
            </h2>
            <p>
              We retain personal information as long as necessary to provide the
              Service, comply with legal obligations, resolve disputes, and
              enforce agreements. Repository and registry metadata may be
              retained as part of the public registry unless removed by the
              publisher.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              7. Security
            </h2>
            <p>
              We use reasonable administrative, technical, and physical
              safeguards to protect data (encryption at rest/in transit, access
              controls). However, no security system is impenetrable; we cannot
              guarantee absolute security.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              8. International Transfers
            </h2>
            <p>
              Your data may be transferred to and processed in countries other
              than your own. When doing so, we implement appropriate safeguards
              to ensure adequate protection.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              9. Children's Privacy
            </h2>
            <p>
              The Services are not intended for children under 13. We do not
              knowingly collect personal information from children under 13; if
              discovered, we will take steps to delete it.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              10. Cookies & Tracking
            </h2>
            <p>
              We use cookies and similar technologies for authentication,
              session management, and analytics. You can opt out through browser
              settings or available preference controls.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              11. Open Source & Public Data
            </h2>
            <p>
              SuperBox includes open-source components. MCP registry entries you
              publish may become publicly accessible in our S3-backed registry;
              do not publish secrets or credentials.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              12. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will post
              the updated policy with a revised "Last updated" date. Continued
              use after changes constitutes acceptance.
            </p>

            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              13. Contact
            </h2>
            <p>
              If you have questions or requests regarding this policy, contact
              us at <strong>support@superbox.ai</strong>.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
