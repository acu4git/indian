export default function MenuDetailPage({ params, searchParams }: { params: { id: string }, searchParams: { name?: string, description?: string } }) {
    if (!params.id) {
        return <div className="text-white">カレー味の注文は店にお尋ねください。</div>;
    }

    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
            <div className="border-2 border-cyan-400 p-8 rounded-lg shadow-lg shadow-cyan-400/20">
                <p className="text-lg text-gray-400 mb-2">{params.id}</p>
                <h1 className="text-4xl font-bold mb-4">{searchParams.name}</h1>
                <p className="text-xl">{searchParams.description}</p>
            </div>
        </div>
    );
}
