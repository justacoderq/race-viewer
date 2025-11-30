import React, { useEffect, useState } from "react";
import ArSection from "../layouts/ArSection";
import TelemetrySection from "../layouts/TelemetrySection";

export function LandingPage2025() {
    const [layoutMobile, setLayoutMobile] = useState();

    useEffect(() => {
        const handleLayout = () => {
            setLayoutMobile(window.innerWidth < 768);
        };
        handleLayout();
        window.addEventListener("resize", handleLayout);
        return () => window.removeEventListener("resize", handleLayout);
    }, []);

    return (
        <div>
            {/* AR Section */}
            <ArSection layoutMobile={layoutMobile} />

            {/* Telemetry Section */}
            <TelemetrySection layoutMobile={layoutMobile} />
        </div>
    );
}
