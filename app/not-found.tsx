import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">404</h2>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <Link
                href="/"
                className="px-6 py-2 bg-black text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
                Return Home
            </Link>
        </div>
    );
}
