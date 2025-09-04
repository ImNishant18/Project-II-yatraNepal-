import React, { useState, useContext, useRef, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Feature from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import PropertyList from "../../components/propertyList/PropertyList";
import MailList from "../../components/mailList/MailList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import "./stays.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useFetch from "../../hooks/useFetch";

const Stays = () => {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false);
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1,
    });
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1000);

    const dateRef = useRef();
    const optionsRef = useRef();

    const { dispatch } = useContext(SearchContext);
    const navigate = useNavigate();

    // Fetch featured properties
    const { data: featuredData, loading: featuredLoading } = useFetch(
        "  http://localhost:8800/api/hotels?featured=true&limit=4"
    );

    // Fetch property list counts
    const { data: propertyListData } = useFetch("  http://localhost:8800/api/hotels/countByType");

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dateRef.current && !dateRef.current.contains(e.target)) {
                setOpenDate(false);
            }
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setOpenOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOption = (name, operation) => {
        setOptions((prev) => ({
            ...prev,
            [name]: operation === "i" ? prev[name] + 1 : Math.max(prev[name] - 1, (name === "adult" || name === "room") ? 1 : 0),
        }));
    };

    const handleSearch = () => {
        if (!destination.trim()) {
            alert("Please enter a destination");
            return;
        }

        dispatch({
            type: "NEW_SEARCH",
            payload: {
                destination,
                dates,
                options,
                min,
                max
            }
        });

        navigate("/hotels", {
            state: {
                destination,
                dates,
                options,
                min,
                max
            }
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="staysPage">
            <Navbar />
            <Header />

            {/* Modern Search Bar */}
            <div className="searchSection">
                <div className="searchContainer">
                    <h2 className="searchTitle">Find your perfect stay</h2>
                    <p className="searchSubtitle">Search deals on hotels, homes, and much more...</p>

                    <div className="searchBar">
                        <div className="searchItem">
                            <div className="inputGroup">
                                <FontAwesomeIcon icon={faBed} className="searchIcon" />
                                <input
                                    type="text"
                                    placeholder="Where are you going?"
                                    className="searchInput"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>

                        <div className="searchItem" ref={dateRef}>
                            <div className="inputGroup">
                                <FontAwesomeIcon icon={faCalendarDays} className="searchIcon" />
                                <div
                                    onClick={() => setOpenDate(!openDate)}
                                    className="searchText"
                                >
                                    {`${format(dates[0].startDate, "MMM dd")} - ${format(dates[0].endDate, "MMM dd")}`}
                                </div>
                            </div>
                            {openDate && (
                                <div className="datePickerContainer">
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={(item) => setDates([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dates}
                                        className="datePicker"
                                        minDate={new Date()}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="searchItem" ref={optionsRef}>
                            <div className="inputGroup">
                                <FontAwesomeIcon icon={faPerson} className="searchIcon" />
                                <div
                                    onClick={() => setOpenOptions(!openOptions)}
                                    className="searchText"
                                >
                                    {`${options.adult} adult · ${options.children} children · ${options.room} room`}
                                </div>
                            </div>
                            {openOptions && (
                                <div className="optionsDropdown">
                                    {["adult", "children", "room"].map((key) => (
                                        <div className="optionItem" key={key}>
                                            <span className="optionLabel">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </span>
                                            <div className="optionControls">
                                                <button
                                                    disabled={options[key] <= (key === "adult" || key === "room" ? 1 : 0)}
                                                    className="optionBtn"
                                                    onClick={() => handleOption(key, "d")}
                                                >
                                                    -
                                                </button>
                                                <span className="optionValue">{options[key]}</span>
                                                <button
                                                    className="optionBtn"
                                                    onClick={() => handleOption(key, "i")}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="searchItem">
                            <button className="searchBtn" onClick={handleSearch}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stayContainer">
                <h1 className="sectionTitle">Browse by Cities</h1>
                <Feature />
                <h1 className="sectionTitle">Browse by property type</h1>
                <PropertyList propertyList={propertyListData} />
                <h1 className="sectionTitle">Homes guests love</h1>
                <FeaturedProperties featuredProperties={featuredData} loading={featuredLoading} />
                <MailList />
                <Footer />
            </div>
        </div>
    );
};

export default Stays;