
export const fadeInOnScroll = (
  element: HTMLElement,
  options: {
    threshold?: number;
    rootMargin?: string;
    animationClass?: string;
    delay?: number;
  } = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    animationClass = "animate-fade-in",
    delay = 0
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(animationClass);
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold, rootMargin }
  );
  
  observer.observe(element);
  
  return () => {
    observer.unobserve(element);
  };
};

export const addStaggeredAnimations = (
  parentElement: HTMLElement,
  childSelector: string,
  animationClass: string = "animate-fade-in",
  baseDelay: number = 100
) => {
  const children = parentElement.querySelectorAll(childSelector);
  children.forEach((child, index) => {
    const delay = index * baseDelay;
    setTimeout(() => {
      child.classList.add(animationClass);
    }, delay);
  });
};
