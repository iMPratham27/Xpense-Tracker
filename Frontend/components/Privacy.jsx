
export const Privacy = () => {
  return (
    <div className="p-6 md:p-10 bg-bg min-h-screen text-text font-sans animate-fadeIn">
      <div className="max-w-3xl mx-auto bg-bg-light rounded-2xl shadow-sm hover:shadow-md transition-all p-6 md:p-10">
        <h1 className="text-3xl font-semibold mb-4">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-6">Last updated: October 2025</p>

        <section className="space-y-4 text-text-muted leading-relaxed">
          <p>
            Welcome to <strong>Xpense Tracker</strong> — a personal finance demo application created for educational and portfolio purposes.
            We respect your privacy and want to be transparent about how your information is used.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">1. Information We Collect</h3>
          <p>
            When you sign in using <strong>Google Login</strong>, we only access your <strong>name</strong>, <strong>email address</strong>,
            and <strong>profile picture</strong> — provided by Google OAuth. We do not access your contacts, emails, or any sensitive data.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">2. How We Use Your Information</h3>
          <p>
            Your information is used solely to create and identify your personal account within the app. None of your data is shared, sold,
            or used for marketing purposes.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">3. Data Storage</h3>
          <p>
            Basic data like your transactions and expense limits are securely stored in a private database (MongoDB Atlas). You can log out
            anytime to clear your session.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">4. Cookies</h3>
          <p>
            A secure cookie is used for authentication (to keep you signed in). We do not use tracking or analytics cookies.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">5. Contact</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{" "}
            <span className="font-medium text-text">xpensetracker09@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
};
