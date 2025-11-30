import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ReactSelectComponent } from "./Select";
import { RaceSelector } from "./RaceSelector";
import { fetchRacesAndSessions } from "../utils/api";
import { Modal } from "./Modal";

export const Header = ({ setResultPage, setResultPagePath }) => {
    const [races, setRaces] = useState([]);
    const [selectedYear, setSelectedYear] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [headerOpen, setHeaderOpen] = useState(false);
    const [raceViewerDropdownOpen, setRaceViewerDropdownOpen] = useState(false);

    const raceViewerRef = useRef(null);
    const headerRef = useRef(null);

    const location = useLocation().pathname;
    const collapsible = location.startsWith("/race/");

    useEffect(() => {
        const handleResize = () => setHeaderOpen(window.innerWidth > 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (selectedYear.length > 0) {
            const fetchData = async () => {
                const data = await fetchRacesAndSessions(selectedYear);
                setRaces(data);
            };
            fetchData();
        }
    }, [selectedYear]);

    const handleClickOutside = (event) => {
        if (raceViewerRef.current && !raceViewerRef.current.contains(event.target)) {
            setRaceViewerDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const generateYears = (startYear) => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= startYear; year--) {
            years.push({ value: year.toString(), label: year.toString() });
        }
        return years;
    };

    const yearOptions = generateYears(2023);
    const handleYearChange = (selectedOption) => setSelectedYear(selectedOption.value);
    const toggleOpen = () => setIsOpen(!isOpen);

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
                onChange={() => {
                    setRaceViewerDropdownOpen(false);
                    setIsOpen(false);
                }}
            />
        </>
    );

    return (
        <>
            <header
                className={classNames("global-header max-md:transition-all", {
                    "!top-[-58px]": !headerOpen && collapsible,
                })}
                ref={headerRef}
            >
                <div className="global-header__main-nav shadow-lg bg-neutral-900/60 backdrop-blur-md">
                    <div className="global-header__main-nav__left flex items-center gap-32">
                        <a href="/">{/* Logo removed */}</a>
                    </div>

                    {/* Mobile */}
                    <button className="md:hidden p-8" onClick={toggleOpen}>
                        <FontAwesomeIcon icon="bars" className="fa-2x" />
                    </button>

                    {collapsible && (
                        <button
                            className="absolute top-full right-20 bg-glow-large py-2 px-10 rounded-b-sm md:hidden"
                            onClick={() => setHeaderOpen(!headerOpen)}
                        >
                            <FontAwesomeIcon
                                icon="chevron-down"
                                className={classNames("fa-1x transition-all", {
                                    "transform rotate-180": headerOpen,
                                })}
                            />
                        </button>
                    )}

                    {/* Desktop */}
                    <div className="flex items-center gap-16 max-md:hidden">
                        <div className="relative w-max" ref={raceViewerRef}>
                            <button
                                className="global-header__main-nav__button py-12 px-24 rounded-[.8rem] uppercase tracking-xs text-sm "
                                onClick={() =>
                                    setRaceViewerDropdownOpen(!raceViewerDropdownOpen)
                                }
                            >
                                Race Viewer
                                <FontAwesomeIcon
                                    icon="chevron-down"
                                    className={classNames(
                                        "global-header__main-nav__button__icon opacity-0",
                                        { "opacity-100": raceViewerDropdownOpen }
                                    )}
                                />
                            </button>
                            <div
                                className={classNames(
                                    "absolute right-1 -mt-2 pt-12 w-max min-w-[20rem]",
                                    raceViewerDropdownOpen ? "block" : "hidden"
                                )}
                            >
                                <div className="flex flex-col p-16 rounded-md bg-glow bg-neutral-800 shadow-lg">
                                    {raceSelectorContent}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider-glow-dark" />
            </header>

            {/* Mobile */}
            <Modal isOpen={isOpen} onClose={toggleOpen}>
                <div className="fixed top-[0] left-[0] w-full h-full bg-glow bg-neutral-900/95 backdrop-blur-sm md:hidden z-[1001]">
                    <div className="pt-64 px-32">
                        {/* Race Viewer */}
                        <div className="mt-16">{raceSelectorContent}</div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

Header.propTypes = {
    setResultPage: PropTypes.func.isRequired,
    setResultPagePath: PropTypes.func.isRequired,
};
