import Image from "next/image";

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/diamond logo.svg"
            alt="Diamond Acquisitions"
            width={80}
            height={80}
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Diamond Acquisitions
        </h1>

        <p className="text-gray-600 mb-8">
          Access our exclusive investor portal to view current opportunities,
          track your investments, and connect with our team.
        </p>

        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full bg-gradient-to-r from-slate-900 to-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-900 hover:to-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Sign In
          </a>

          <a
            href="/request-access"
            className="block w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            Request Access
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            For assistance, contact us at{" "}
            <a
              href="mailto:support@diamondacquisitions.com"
              className="text-blue-600 hover:underline"
            >
              support@diamondacquisitions.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
