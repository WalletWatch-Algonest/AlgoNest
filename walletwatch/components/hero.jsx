//import Link from "next/link";
//import { Button } from "react-day-picker";
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRef } from "react";
import { useEffect } from "react";

const HeroSection = () => {
     const imageRef = useRef();
     useEffect(()=>{
        const imageElement=imageRef.current;

        const handleScroll=()=>
        {

            const scrollPosition =window.scrollY;
            const scrollThreshold=100;
            if(scrollPosition>scrollThreshold)
            {
                imageElement.classList.add("scrolled");
            }
            else{
                imageElement.classList.remove("scrolled");
            }

        };

        window.addEventListener("scroll",handleScroll);

        return ()=>window.removeEventListener("scroll",handleScroll);
    },[]);
  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] font-extrabold tracking-tighter pr-2 pb-4 gradient-title">
          Manage Your Finances <br /> with Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">

          An AI-powered financial management platform that helps uou track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority />
          </div>
        </div>
      </div>
    </div>
  )
};
export default HeroSection;
// This is a simple React component named 'hero' that returns a div containing the text "hero".