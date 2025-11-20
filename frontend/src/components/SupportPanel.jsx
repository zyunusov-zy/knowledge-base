export default function SupportPanel({ onBack }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Support Center
      </h2>

      <div className="space-y-4 text-gray-700">
        <p><strong>Email:</strong> support@docsapi.com</p>
        <p><strong>Phone:</strong> +998 90 123 45 67</p>

        <p>
          <strong>Telegram:</strong>{" "}
          <a
            href="https://t.me/docsapi_support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            @docsapi_support
          </a>
        </p>
      </div>

      <button
        onClick={onBack}
        className="mt-8 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 rounded-lg transition shadow-sm"
      >
        Back to Login
      </button>
    </div>
  );
}
