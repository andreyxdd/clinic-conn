import { useState, useEffect, MutableRefObject } from 'react';

function useInViewport<T extends Element>(element: MutableRefObject<T>, rootMargin: string) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, { rootMargin },
    );

    if (element.current) observer.observe(element.current);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      observer.unobserve(element.current);
    };
  }, [element, rootMargin]);

  return isVisible;
}

export default useInViewport;
