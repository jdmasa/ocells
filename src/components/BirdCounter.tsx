import { useState } from 'react';
import { Bird, Minus, Plus } from 'lucide-react';

interface BirdCounterProps {
  birdName: string;
  count: number;
  isCustom?: boolean;
  onCountChange: (count: number) => void;
}

export function BirdCounter({ birdName, count, isCustom = false, onCountChange }: BirdCounterProps) {
  const [showDetail, setShowDetail] = useState(false);

  const increment = () => {
    onCountChange(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      onCountChange(count - 1);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDetail(true)}
        className={`aspect-square bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center p-4 ${
          count > 0 ? 'ring-2 ring-amber-500' : ''
        }`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
          isCustom ? 'bg-sky-100' : 'bg-amber-100'
        }`}>
          <Bird className={`w-8 h-8 ${isCustom ? 'text-sky-600' : 'text-amber-600'}`} />
        </div>
        <p className="text-sm font-medium text-gray-800 text-center line-clamp-2">{birdName}</p>
        {count > 0 && (
          <div className="mt-2 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
            {count}
          </div>
        )}
      </button>

      {showDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
                isCustom ? 'bg-sky-100' : 'bg-amber-100'
              }`}>
                <Bird className={`w-10 h-10 ${isCustom ? 'text-sky-600' : 'text-amber-600'}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center">{birdName}</h3>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={decrement}
                disabled={count === 0}
                className="w-14 h-14 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
              >
                <Minus className="w-6 h-6 text-gray-700" />
              </button>

              <div className="w-24 h-24 bg-amber-50 rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-amber-600">{count}</span>
              </div>

              <button
                onClick={increment}
                className="w-14 h-14 bg-amber-600 hover:bg-amber-700 rounded-full flex items-center justify-center transition-colors"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>

            <button
              onClick={() => setShowDetail(false)}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Tancar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
