export default function BgGradient({ children, className }) {
  return (
    <div className={`relative isolate ${className || ""}`}>
      {/* Top gradient orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40
         -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-30"
      >
        <div
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%,50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678
          w-144.5 -translate-x-1/2 rotate-30 
          bg-gradient-to-br from-rose-400/15 via-transparent to-indigo-400/15 
          dark:from-rose-500/10 dark:via-transparent dark:to-indigo-500/10
          opacity-70 dark:opacity-50 sm:left-[calc(50%-30rem)] sm:w-6xl"
        />
      </div>
      {/* Bottom gradient orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[calc(100%-40rem)]
         -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678
          w-144.5 -translate-x-1/2 
          bg-gradient-to-tr from-amber-400/10 via-transparent to-rose-400/10 
          dark:from-amber-500/5 dark:via-transparent dark:to-rose-500/5
          opacity-60 dark:opacity-40 sm:left-[calc(50%+36rem)] sm:w-288.75"
        />
      </div>

      {children}
    </div>
  );
}
