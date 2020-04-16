import React from "react";
import { Home, Info, Search, Star } from "react-feather";
import { Link } from "react-router-dom";

export const Toolbar = () => (
    <div className="toolbar">
        <div>
            <Link to={"/"}>
                <Home size={18} />
                <span>Home</span>
            </Link>
        </div>
        <div
            onClick={(event) => {
                event.preventDefault();
                alert("Show search");
            }}>
            <Search size={18} />
            <span>Search</span>
        </div>
        <div
            onClick={(event) => {
                event.preventDefault();
                alert("Show saved");
            }}>
            <Star size={18} />
            <span>Saved</span>
        </div>
        <div>
            <Link to={"/about"}>
                <Info size={18} />
                <span>About</span>
            </Link>
        </div>
    </div>
);
