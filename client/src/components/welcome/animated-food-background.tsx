type AnimatedFoodItemProps = {
  id: number;
  src: string;
  alt: string;
  side: "left" | "right";
  scale: number;
};

export function AnimatedFoodItem({
  id,
  src,
  alt,
  side,
  scale,
}: AnimatedFoodItemProps) {
  return (
    <div
      key={id}
      className={`absolute bottom-0 ${
        side === "left"
          ? "left-0 animate-throw-x-ltr"
          : "right-0 animate-throw-x-rtl"
      }`}
    >
      <div className="animate-throw-y">
        <div className="w-36 h-36 animate-throw-rotate">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain drop-shadow-2xl"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  );
}

type AnimatedFoodBackgroundProps = {
  animatedItems: Array<AnimatedFoodItemProps>;
};

export function AnimatedFoodBackground({
  animatedItems,
}: AnimatedFoodBackgroundProps) {
  return (
    <>
      {animatedItems.map((item) => (
        <AnimatedFoodItem
          key={item.id}
          id={item.id}
          src={item.src}
          alt={item.alt}
          side={item.side}
          scale={item.scale}
        />
      ))}
    </>
  );
}
