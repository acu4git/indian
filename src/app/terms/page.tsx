import AgreementCard from "./components/agreement-card";
import InfiniteTerms from "./components/infinite-terms";

export default function TermsPage() {
  return (
    <div className="flex flex-col w-dvw">
      <h1 className="text-3xl font-bold mb-6 mx-auto fixed">利用規約</h1>
      <InfiniteTerms />
      <AgreementCard />
    </div>
  );
}
