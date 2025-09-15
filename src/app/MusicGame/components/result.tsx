'use client';

type ResultProps = {
    finalResult: string;
    onPlayAgain: () => void;
};

// 結果表示コンポーネント
export const Result = ({ finalResult, onPlayAgain }: ResultProps) => {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
        <div className="text-center space-y-6">
          <div className="text-4xl font-bold mb-8">RESULT</div>
          <div className="text-xl font-mono whitespace-pre-line">    {finalResult}</div>
          <button
            onClick={onPlayAgain}
            className="px-8 py-3 border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-colors"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
}
