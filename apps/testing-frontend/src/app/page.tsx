import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          EduCTX Testing Platform
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/interop-testing"
            className="flex items-center justify-center p-4 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-all duration-200 shadow-sm text-center transform hover:-translate-y-1"
          >
            Interop Testing
          </Link>

          <Link
            href="/vector-demo"
            className="flex items-center justify-center p-4 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-all duration-200 shadow-sm text-center transform hover:-translate-y-1"
          >
            Verifier Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
