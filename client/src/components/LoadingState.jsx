const MESSAGES = [
  "Finding savings better than skipping avocado toast...",
  "Hunting down the best dupes for you...",
  "Comparing products across the internet...",
  "Your wallet is about to thank you...",
];

export default function LoadingState() {
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  return (
    <div className="loading">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
