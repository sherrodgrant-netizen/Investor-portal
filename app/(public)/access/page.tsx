import Image from "next/image";

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center border border-gray-200">
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
            className="block w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Sign In
          </a>

          <a
            href="/signup"
            className="block w-full bg-white text-black py-3 px-6 rounded-lg font-semibold border-2 border-black hover:bg-gray-50 transition-all duration-300"
          >
            Sign Up
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            For assistance, contact us at{" "}
            <a
              href="mailto:support@diamondacquisitions.com"
              className="text-black hover:underline font-medium"
            >
              support@diamondacquisitions.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
