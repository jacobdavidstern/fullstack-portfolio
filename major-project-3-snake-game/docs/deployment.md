# Deployment Notes

## Quote API Change (April 2026)

- Quotable API failed on Vercel due to mixed-content (HTTP → HTTPS) restrictions.
- Local dev worked over HTTP, but production required HTTPS.
- Switched to https://api.adviceslip.com/advice as a stable HTTPS alternative.

```js // src/hooks/useQuote.js
import { useState, useEffect } from 'react';

export default function useQuote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch('http://api.quotable.io/random');
        const data = await res.json();
        setQuote(data.content);
      } catch (e) {
        console.error('Quote fetch failed:', e);
        setQuote('Press Start to Continue');
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, []);

  return { quote, loading };
}
```
