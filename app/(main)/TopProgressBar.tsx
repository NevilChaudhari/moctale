'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function TopProgressBar() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

    // Skip the first render
    // if (firstRender.current) {
    //   firstRender.current = false;
    //   return;
    // }

    NProgress.start();

    // Finish after 800ms or whenever you want
    const timer = setTimeout(() => {
      NProgress.done();
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}