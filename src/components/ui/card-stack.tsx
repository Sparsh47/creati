"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

let interval: any;

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
                            items,
                            offset,
                            scaleFactor,
                          }: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);
  };

  return (
      <div className="relative h-60 w-60 md:h-60 md:w-96">
        {cards.map((card, index) => (
            <motion.div
                key={card.id}
                className="
            absolute
            h-60 w-60 md:h-60 md:w-96
            rounded-2xl
            p-6
            bg-white
            dark:bg-gray-800
            border-2
            border-blue-100
            dark:border-gray-700/30
            shadow-xl
            shadow-blue-500/30
            dark:shadow-blue-900/40
            flex flex-col justify-between
          "
                style={{ transformOrigin: "top center" }}
                animate={{
                  top: index * -CARD_OFFSET,
                  scale: 1 - index * SCALE_FACTOR,
                  zIndex: cards.length - index,
                }}
            >
              <div className="space-y-2">
                <div className="text-base font-medium text-gray-500 dark:text-gray-400">{card.designation}</div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{card.name}</h3>
                <p className="mt-2 text-neutral-700 dark:text-neutral-200 font-normal">
                  {card.content}
                </p>
              </div>
            </motion.div>
        ))}
      </div>
  );
};
