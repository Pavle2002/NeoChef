import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { foodImages } from "@/assets/index.tsx";

type HeroSectionProps = React.ComponentPropsWithoutRef<"div">;
type ShadowSize =
  | "drop-shadow-2xl"
  | "drop-shadow-3xl"
  | "drop-shadow-4xl"
  | "drop-shadow-5xl"
  | "drop-shadow-6xl"
  | "drop-shadow-7xl";
type FoodImageProps = {
  src: string; // Path to the image
  alt: string; // Alt text for the image
  rotate: number; // Rotation angle in degrees
  mirror: boolean; // Whether to mirror the image
  size: number; // Size of the image in percentage
  position: { left: number; top: number }; // Position of the image in pixels
  isInfront?: boolean; // Whether the image should be in front of others
  shadowSize?: ShadowSize; // Shadow size of the image
};

export default function HeroSection({ className, ...props }: HeroSectionProps) {
  return (
    <div
      className={cn(
        "relative self-center justify-center aspect-[4/3] w-[820px] ",
        className
      )}
      {...props}
    >
      <div className="flex flex-col justify-center py-[72px] px-12 size-full gap-4 backdrop-blur-xl bg-gradient-to-br from-neutral-200/42 to-neutral-400/42 border-neutral-300 border-t-neutral-50 border-l-neutral-50 border-[3px] rounded-2xl drop-shadow-5xl z-20">
        <h1 className="text-[clamp(3rem,3vw+0.4rem,4rem)]/[clamp(3rem,3vw+0.5rem,4.4rem)] font-extrabold text-primary  ">
          {/* Let us find recipes based on your ingredients, taste and lifestyle */}
          Let AI help you <br />
          cook smarter with
          <br />
          recipes based on <br />
          your taste
        </h1>
        <p className="mr-28 text-secondary-foreground">
          Get custom meals from the ingredients you already own. AI meets home
          cooking — fast, personal, super easy, surprisingly fun, and tailored
          to your taste.
        </p>
        <div className="flex flex-row gap-4">
          <Button variant="default" asChild={true}>
            <Link to="/login">Get started</Link>
          </Button>
          <Button variant="outline" asChild={true}>
            <Link to="/">Github</Link>
          </Button>
        </div>
      </div>

      <FoodImage
        src={foodImages.banana}
        alt="Banana"
        rotate={-95}
        mirror={false}
        size={40}
        position={{ left: -48, top: -29 }}
        shadowSize="drop-shadow-4xl"
      />
      <FoodImage
        src={foodImages.carrot}
        alt="Carrot"
        rotate={20}
        mirror={false}
        size={45}
        position={{ left: -53, top: 35 }}
        shadowSize="drop-shadow-2xl"
      />
      <FoodImage
        src={foodImages.tomato}
        alt="Tomato"
        rotate={-110}
        mirror={false}
        size={76}
        position={{ left: -50, top: 67 }}
        shadowSize="drop-shadow-5xl"
      />
      <FoodImage
        src={foodImages.raspberry}
        alt="Raspberry"
        rotate={-26}
        mirror={true}
        size={19}
        position={{ left: 15, top: -15 }}
        isInfront={true}
        shadowSize="drop-shadow-5xl"
      />
      <FoodImage
        src={foodImages.chiken}
        alt="Chiken"
        rotate={-26}
        mirror={false}
        size={40}
        position={{ left: -3, top: 20 }}
      />
      <FoodImage
        src={foodImages.grapes}
        alt="Grapes"
        rotate={-27}
        mirror={true}
        size={27}
        position={{ left: 49, top: 60 }}
        shadowSize="drop-shadow-2xl"
      />
      <FoodImage
        src={foodImages.pear}
        alt="Pear"
        rotate={-140}
        mirror={false}
        size={29}
        position={{ left: 54, top: -25 }}
        shadowSize="drop-shadow-2xl"
      />
      <FoodImage
        src={foodImages.onion}
        alt="Onion"
        rotate={-20}
        mirror={true}
        size={32}
        position={{ left: 20, top: 85 }}
        shadowSize="drop-shadow-2xl"
      />
      <FoodImage
        src={foodImages.pineapple}
        alt="Pinapple"
        rotate={25}
        mirror={false}
        size={45}
        position={{ left: 97, top: -25 }}
      />
      <FoodImage
        src={foodImages.eggplant}
        alt="Eggplant"
        rotate={0}
        mirror={true}
        size={50}
        position={{ left: 60, top: 84 }}
        isInfront={true}
        shadowSize="drop-shadow-5xl"
      />
      <FoodImage
        src={foodImages.peach}
        alt="Peach"
        rotate={-10}
        mirror={false}
        size={25}
        position={{ left: 84, top: 35 }}
        isInfront={true}
        shadowSize="drop-shadow-7xl"
      />
      <FoodImage
        src={foodImages.steak}
        alt="Steak"
        rotate={-110}
        mirror={true}
        size={50}
        position={{ left: 100, top: 54 }}
        shadowSize="drop-shadow-2xl"
      />
      <FoodImage
        src={foodImages.egg}
        alt="Egg"
        rotate={-110}
        mirror={true}
        size={25}
        position={{ left: 143, top: -30 }}
        shadowSize="drop-shadow-2xl"
      />
      <FoodImage
        src={foodImages.lemon}
        alt="Lemon"
        rotate={-100}
        mirror={false}
        size={34}
        position={{ left: 183, top: -30 }}
        shadowSize="drop-shadow-6xl"
      />
    </div>
  );
}

function FoodImage({
  src,
  alt,
  rotate,
  mirror,
  size,
  position,
  isInfront,
  shadowSize = "drop-shadow-3xl",
}: FoodImageProps) {
  return (
    <div
      className={`absolute ${shadowSize}`}
      style={{
        width: `${size}%`,
        height: `${size}%`,
        left: `${position.left}%`,
        top: `${position.top}%`,
        zIndex: `${isInfront ? 10 : -10}`,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          transform: `rotate(${rotate}deg) ${mirror ? "scaleX(-1)" : ""}`,
        }}
      />
    </div>
  );
}
