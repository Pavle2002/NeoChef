import HeroSection from "@/components/welcome/HeroSection";
import Navbar from "@/components/welcome/Navbar";
import { chefImage } from "@/assets/index";

export default function Welcome() {
  return (
    <div className="overflow-hidden scroll-smooth">
      <div className="flex flex-col justify-self-center w-[72%] h-screen">
        <Navbar className="backdrop-blur-md rounded-2xl z-20" />
        <div className="flex flex-row grow-1 justify-between w-full">
          <HeroSection className="self-center mb-16" />
          <div className="flex flex-rew relative self-end drop-shadow-6xl size-[700px]">
            <img
              src={chefImage}
              alt="Chef Image"
              className="self-end absolute 3xl:left-[40%] translate-y-[-15%] scale-x-[-1.3] scale-y-[1.3] "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
