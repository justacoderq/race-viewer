import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import classNames from "classnames";

import { ReactSelectComponent } from "../components/Select";
import { RaceSelector } from "../components/RaceSelector";
import { fetchRacesAndSessions } from "../utils/api";

/* ---------------- LANDING VIDEO COMPONENT ---------------- */
const LandingVideo = () => {
  return (
    <div className="w-full flex justify-center items-center mt-32 mb-40">
      <video
        className="w-[95%] max-w-[1600px] rounded-2xl shadow-2xl"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={`${process.env.PUBLIC_URL}/LandingPageVid25.mp4`}
          type="video/mp4"
        />
      </video>
    </div>
  );
};



/* ---------------- MAIN TELEMETRY SECTION ---------------- */
const TelemetrySection = ({ layoutMobile }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yTextContent = useTransform(
    scrollYProgress,
    [0, 1],
    layoutMobile ? [0, 0] : [50, -50]
  );

  // Race Viewer states
  const [races, setRaces] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (selectedYear) {
      const fetchData = async () => {
        const data = await fetchRacesAndSessions(selectedYear);
        setRaces(data);
      };
      fetchData();
    }
  }, [selectedYear]);

  const generateYears = (startYear) => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= startYear; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };

  const yearOptions = generateYears(2023);
  const handleYearChange = (selectedOption) =>
    setSelectedYear(selectedOption.value);

  const raceSelectorContent = (
    <>
      <ReactSelectComponent
        placeholder="Select Year"
        options={yearOptions}
        onChange={handleYearChange}
        value={yearOptions.find((option) => option.value === selectedYear)}
        className="w-full mb-8"
        isSearchable={false}
      />
      <RaceSelector
        races={races}
        selectedYear={selectedYear}
        onChange={() => {}}
      />
    </>
  );

  return (
    <section className="ar-experience-section pb-64 bg-gradient-to-b from-neutral-950/30 to-neutral-950/5 pt-40">

      {/* ----------------- PROJECT TITLE ----------------- */}
      <h1 className="text-center heading-2 mb-16 pt-48 md:pt-64">
        Welcome to Enviro F1 – Data, Telemetry, AR & Race Intelligence
      </h1>

      {/* ----------------- LANDING VIDEO ----------------- */}
      <LandingVideo />

      <div className="divider-glow-dark mb-64" />

      <div className="max-w-screen-lg mx-auto">
        <h2 className="heading-3 text-center mb-64">
          Interactive Telemetry & Race Viewer
        </h2>

        <div
          ref={sectionRef}
          className="flex flex-col md:flex-row items-center mx-auto relative"
        >
          {/* Left Text/Info */}
          <motion.div
            className={classNames(
              "p-32 md:py-32 md:pr-32 md:pl-64 md:ml-[-100px] md:rounded-xlarge max-md:text-small max-md:text-center",
              "w-full md:w-1/3 flex flex-col max-md:items-center gap-8 relative z-10",
              "md:bg-gradient-to-b md:from-neutral-900 md:to-neutral-900/10"
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ y: yTextContent }}
          >
            <p className="uppercase font-semibold tracking-xs gradient-text-light">
              Select a Driver
            </p>
            <p className="mb-12">Monitor their race progress lap by lap.</p>

            <p className="uppercase tracking-xs gradient-text-light">
              Multiple Camera Views
            </p>
            <p className="mb-12">
              Get closer to the action with various perspectives.
            </p>

            <p className="uppercase tracking-xs gradient-text-light">
              Detailed Telemetry Data
            </p>
            <p className="mb-12">
              Analyze every aspect of driver performance.
            </p>
          </motion.div>

          {/* Telemetry Image (RIGHT) */}
          <motion.div
            className="w-full sm:w-2/3 z-10"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/telemetryImage.png`}
              alt="Telemetry"
              className="w-full h-auto rounded-xl shadow-xl"
            />
            <div className="divider-glow-dark -mt-8" />
          </motion.div>
        </div>

        {/* Race Viewer Dropdown */}
        <div className="max-w-screen-md mx-auto mt-16">
          <div className="flex flex-col p-16 rounded-md bg-glow bg-neutral-800 shadow-lg">
            {raceSelectorContent}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TelemetrySection;
