import Link from "next/link";

export const AdModal = () => {
    return (
           <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-gray-800 border border-gray-600 p-6 rounded relative">
              <Link 
                href={`/FlavorGame`}
                className="absolute top-2 right-2 text-white text-2xl hover:text-red-500 transition-colors"
              >
                ×
              </Link>
              <div className="text-white text-center">
                <h2 className="text-2xl mb-4">Shari Carry</h2>
                <p className="text-lg">ぜひインストールしてね！</p>
              </div>
            </div>
          </div>
    );
}