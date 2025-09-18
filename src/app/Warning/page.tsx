import WarningMessage from "./components/WarningMessage";
import BackButton from "./components/BackButton";
import IgnoreButton from "./components/IgnoreButton";

export default function WarningPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-6">
      <div className="max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <WarningMessage />
        <div className="mt-6 flex justify-center">
          <BackButton />
          <IgnoreButton />
        </div>
      </div>
    </main>
  );
}
