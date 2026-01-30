"use client";

import Lottie from "lottie-react";
import React from "react";

interface LottieAnimationProps {
    animationData: any;
    className?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, className }) => {
    return (
        <div className={className}>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};

export default LottieAnimation;
