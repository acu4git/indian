import InfiniteTerms from "./components/infinite-terms";

export default function TermsPage() {
  return (
    <div className="flex flex-col w-dvw">
      <h1 className="text-3xl font-bold mb-6 mx-auto fixed">利用規約</h1>
      <InfiniteTerms />
      <div className="flex flex-row">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          同意する
        </button>
        <button className="bg-gray-300 text-black px-4 py-2 rounded ml-4">
          同意しない
        </button>
      </div>
    </div>
  );
}
