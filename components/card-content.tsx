import { Check } from "lucide-react";

export default function CardContent({
  title,
  heading,
}: {
  title: string[];
  heading?: string;
}) {
  return (
    <div className="flex flex-col gap-5 mt-2 p-3 rounded-2xl md:max-w-sm w-full">
      {heading && (
        <h2 className="text-start mt-2 font-nunito text-primary-dark font-bold text-xl">
          {heading}
        </h2>
      )}
      <div className="space-y-2 p-2">
        {title.map((title, idx) => (
          <p
            key={idx}
            className="text-base items-center gap-2 flex font-roboto text-secondary-dark"
          >
            <Check className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-primary-dark" />
            {title}
          </p>
        ))}
      </div>
    </div>
  );
}
