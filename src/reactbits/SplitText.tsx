import { motion } from 'framer-motion';

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.45, delay: delay + index * 0.018 }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}
