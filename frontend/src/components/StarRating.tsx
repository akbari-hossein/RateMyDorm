interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

export default function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`} role="img" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1;
        const filled = value <= rating;

        if (interactive && onChange) {
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className={`transition hover:scale-110 ${
                filled ? "text-amber-400" : "text-slate-600 hover:text-amber-300"
              }`}
              aria-label={`Rate ${value} stars`}
            >
              ★
            </button>
          );
        }

        return (
          <span
            key={value}
            className={filled ? "text-amber-400" : "text-slate-600"}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
