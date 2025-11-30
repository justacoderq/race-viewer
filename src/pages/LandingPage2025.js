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
            {/* Telemetry Section FIRST */}
            <TelemetrySection layoutMobile={layoutMobile} />

            {/* AR Section SECOND */}
            <ArSection layoutMobile={layoutMobile} />
        </div>
    );
}
