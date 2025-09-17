// このページでかき氷の詳細データを取得して表示します
// 例として、ハードコードしたデータを表示します

// サンプルデータ
const menuData = [
    {id: "giiku-sai", name: "技育祭な いちご味", description: "技育祭をイメージしたいちご味のかき氷"},
    {id: "giiku-haku", name: "技育博な メロン味", description: "技育博をイメージしたメロン味のかき氷"},
    {id: "giiku-ten", name: "技育展な ブルーハワイ味", description: "技育展をイメージしたブルーハワイ味のかき氷"},
    {id: "giiku-camp", name: "技育CAMPな オレンジ味", description: "技育CAMPをイメージしたオレンジ味のかき氷"},
];

export default function MenuDetailPage({ params }: { params: { id: string } }) {
    const item = menuData.find(m => m.id === params.id);

    if (!item) {
        return <div className="text-white">カレー味の注文は店にお尋ねください。</div>;
    }

    return (
        <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
            <div className="border-2 border-cyan-400 p-8 rounded-lg shadow-lg shadow-cyan-400/20">
                <p className="text-lg text-gray-400 mb-2">{item.id}</p>
                <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
                <p className="text-xl">{item.description}</p>
            </div>
        </div>
    );
}
