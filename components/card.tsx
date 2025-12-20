import React from "react";
interface CardProps {
  children?: React.ReactNode;
  heading?: string;
}

export default function Card({ children, heading }: CardProps) {
  return (
    <div className="w-full justify-evenly mx-auto rounded-xl mt-20 p-5 border shadow-sm bg-card-color bg-linear-to-r from-neutral-50 to-blue-50">
      {heading && (
        <h2 className="font-bold font-lato text-2xl text-center text-secondary-dark">
          {heading}
        </h2>
      )}
      {children}
    </div>
  );
}
