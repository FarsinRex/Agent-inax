import ChatBox from '@/components/ChatBox';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white p-4 corner-glow">
      <ThemeToggle />
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-center">Agent Inax</h1>
      </header>

      <div className="relative max-w-6xl mx-auto pt-16 md:pt-20">
        <div className="space-y-8">
          <div className="md:mt-20" />
          <section className="sticky md:static bottom-0 md:bottom-auto">
            <ChatBox />
          </section>
        </div>
      </div>
    </main>
  );
}

