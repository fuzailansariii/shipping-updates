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
            <Check height={17} width={17} />
            <p>{title}</p>
          </p>
        ))}
      </div>
    </div>
  );
}
