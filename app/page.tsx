import ChatBox from '@/components/ChatBox';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="h-screen bg-white dark:bg-neutral-950 text-black dark:text-white overflow-hidden">
      <ThemeToggle />
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-center">Agent Inax</h1>
      </header>

      <div className="h-full pt-16 md:pt-20 pb-8">
        <ChatBox />
      </div>
    </main>
  );
}

