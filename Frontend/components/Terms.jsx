
export const Terms = () => {
  return (
    <div className="p-6 md:p-10 bg-bg min-h-screen text-text font-sans animate-fadeIn">
      <div className="max-w-3xl mx-auto bg-bg-light rounded-2xl shadow-sm hover:shadow-md transition-all p-6 md:p-10">
        <h1 className="text-3xl font-semibold mb-4">Terms of Service</h1>
        <p className="text-sm text-text-muted mb-6">Last updated: October 2025</p>

        <section className="space-y-4 text-text-muted leading-relaxed">
          <p>
            By using <strong>Xpense Tracker</strong>, you agree to the following terms. This project is built purely for learning,
            demonstration, and personal portfolio use.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">1. Purpose</h3>
          <p>
            Xpense Tracker is a <strong>personal demo project</strong> built to demonstrate web development, authentication, and
            expense management functionality.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">2. User Responsibilities</h3>
          <p>
            You are responsible for your own login session and the data you add within the app. Do not misuse the app for unauthorized or
            malicious purposes.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">3. Data Ownership</h3>
          <p>
            All data you create (transactions, expense limits) belongs to you. No personal data is shared or monetized in any way.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">4. Disclaimer</h3>
          <p>
            This application is provided <strong>as-is</strong>, without any guarantees or warranties of any kind. Xpense Tracker is not
            intended for commercial or production use.
          </p>

          <h3 className="text-lg font-semibold text-text mt-6">5. Contact</h3>
          <p>
            For questions or feedback, reach out at:{" "}
            <span className="font-medium text-text">xpensetracker09@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
};
