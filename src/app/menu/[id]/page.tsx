export default async function MenuDetailPage({ 
    params, 
    searchParams 
}: { 
    // 非同期処理はNext.js15ではPromiseで順番に受け取る
    params: Promise<{ id: string }>, 
    searchParams: Promise<{ name?: string, description?: string }> 
}) {
    // paramsとsearchParamsを非同期で取得
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    
    if (!resolvedParams.id) {
        return <div className="text-white">カレー味の注文は店にお尋ねください。</div>;
    }

    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
            <div className="border-2 border-cyan-400 p-8 rounded-lg shadow-lg shadow-cyan-400/20">
                <p className="text-lg text-gray-400 mb-2">{resolvedParams.id}</p>
                <h1 className="text-4xl font-bold mb-4">{resolvedSearchParams.name}</h1>
                <p className="text-xl">{resolvedSearchParams.description}</p>
            </div>
        </div>
    );
}
