import { TestingView } from '@/components/TestingView';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full items-center justify-center text-gray-900">
        <div className="flex flex-col gap-y-4 w-8/12 max-w-7xl rounded-xl border-2 border-gray-300 bg-white shadow-lg p-4">
          <div className="w-full">
            <div className="flex h-min w-full items-center justify-between">
              <div>
                <Image
                  src={'/testing-interop-frontend/images/EDU-Coin.png'}
                  alt="Logo"
                  width={64}
                  height={64}
                />
              </div>
              <div>
                <Image
                  src={'/testing-interop-frontend/images/blockchain-lab.svg'}
                  alt="Logo"
                  width={64}
                  height={64}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">EduCTX SSI Enterprise Wallet</h1>
            <h2 className="text-2xl font-bold">
              Vector Interoperability Testing
            </h2>
          </div>
          <TestingView />
        </div>
      </div>
    </main>
  );
}
