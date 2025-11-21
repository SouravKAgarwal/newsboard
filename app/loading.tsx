export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full"
                    >
                        <div className="w-full h-48 bg-gray-200" />
                        <div className="flex flex-col justify-between p-5 flex-1">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                                    <div className="h-4 w-16 bg-gray-200 rounded" />
                                </div>
                                <div className="h-6 bg-gray-200 rounded mb-2" />
                                <div className="h-6 w-2/3 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-200 rounded mt-3" />
                                <div className="h-4 w-3/4 bg-gray-200 rounded mt-1" />
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="h-3 w-16 bg-gray-200 rounded" />
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
