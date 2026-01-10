// export default function homePage() {
//     return(
//         <div className="bg-red-300 w-dvw h-dvh"></div>
//     )
// }

"use client";

import { useEffect, useState } from "react";

export default function homePage() {
  const [random, setRandom] = useState<number | null>(null);

  useEffect(() => {
    const min = 0;
    const max = 50;
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandom(value);
  }, []); // runs once on mount

  return <div>Random number: {random}</div>;
}
