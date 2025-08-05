
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { LucideIcon } from "lucide-react";

interface AnimatedMetricProps {
  icon: LucideIcon;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  iconClassName?: string;
  delay?: number;
  duration?: number;
  decimals?: number;
}

const AnimatedMetric = ({
  icon: Icon,
  value,
  label,
  prefix = "",
  suffix = "",
  className = "",
  iconClassName = "",
  delay = 0,
  duration = 2,
  decimals = 0
}: AnimatedMetricProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [inView, delay]);

  // Check if prefix contains a range (like "15-20" or "30-60%")
  const isRange = prefix.includes('-') && value === 0;

  return (
    <div ref={ref} className={`text-center p-4 rounded-lg ${className}`}>
      <Icon className={`w-6 h-6 mx-auto mb-2 ${iconClassName}`} />
      <div className="roi-metric-value text-2xl font-bold text-white">
        {shouldAnimate ? (
          isRange ? (
            // For ranges, just display the prefix without animation
            `${prefix}${suffix}`
          ) : (
            <CountUp
              start={0}
              end={value}
              duration={duration}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
              preserveValue
            />
          )
        ) : (
          isRange ? prefix : `${prefix}0${suffix}`
        )}
      </div>
      <div className="roi-metric-label text-sm text-gray-300">{label}</div>
    </div>
  );
};

export default AnimatedMetric;
