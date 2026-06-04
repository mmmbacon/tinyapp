export default function PrivacyContent() {
  return (
    <section className="container pb-5">
      <div className="col tiny-panel p-4 p-md-5">
        <h1>Privacy Policy</h1>
        <p>
          TinyApp is a small URL shortener. We built it to be useful, not to
          harvest your data. This policy explains what we collect, why, and what
          you can do about it.
        </p>
        <p>
          <strong>Effective date:</strong> 4 June 2026
          <br />
          <strong>Last updated:</strong> 4 June 2026
        </p>

        <h3>The short version</h3>
        <ul>
          <li>No account or login is required to shorten a link.</li>
          <li>We store the URLs you submit and the short codes we generate.</li>
          <li>We do not sell your data, run ads, or build profiles about you.</li>
          <li>We do not use third-party analytics or marketing trackers.</li>
        </ul>

        <h3>What we collect</h3>
        <h4>URLs you submit</h4>
        <p>
          When you create a short link, we save the destination URL and the
          generated short code in our database so redirects work. Anyone with the
          short link can use it. URLs you create through this app are visible in
          the shared URL list and can be edited or deleted by anyone using the
          app.
        </p>
        <h4>Server and hosting logs</h4>
        <p>
          Like most websites, our hosting provider may automatically record
          technical data when you visit TinyApp or follow a redirect — for
          example IP address, browser type, request time, and pages requested.
          We use this only to keep the service running, secure, and debug issues.
        </p>
        <h4>What we do not collect</h4>
        <p>
          We do not ask for your name, email, or password to use the core
          service. We do not fingerprint your device or track you across other
          sites.
        </p>

        <h3>How we use your information</h3>
        <p>We use the data above solely to:</p>
        <ul>
          <li>Create and resolve short links</li>
          <li>Operate, maintain, and protect the service</li>
          <li>Fix bugs and respond to abuse if needed</li>
        </ul>

        <h3>Where data is stored</h3>
        <p>
          TinyApp runs on modern cloud infrastructure (including Vercel for
          hosting and Neon for the database). Data may be processed in regions
          where those providers operate. They process data on our behalf under
          their own security and privacy terms.
        </p>

        <h3>Retention</h3>
        <p>
          Short links remain until someone deletes them through the app. Server
          logs are kept only as long as our hosting providers require for
          operations and security, then rotated or discarded.
        </p>

        <h3>Security</h3>
        <p>
          We take reasonable steps to protect stored data, including encrypted
          connections (HTTPS) and access controls on our infrastructure. No
          system is perfectly secure; please do not use TinyApp for sensitive or
          confidential links.
        </p>

        <h3>Children</h3>
        <p>
          TinyApp is not directed at children under 13, and we do not knowingly
          collect personal information from them.
        </p>

        <h3>Changes to this policy</h3>
        <p>
          We may update this page as the app evolves. When we do, we will change
          the &ldquo;Last updated&rdquo; date above. Continued use of TinyApp after an
          update means you accept the revised policy.
        </p>

        <h3>Contact</h3>
        <p>
          Questions about privacy? Open an issue or reach out via{" "}
          <a href="https://github.com/mmmbacon">GitHub</a>.
        </p>
      </div>
    </section>
  );
}
