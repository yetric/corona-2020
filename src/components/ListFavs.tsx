import React from "react";
import { observer } from "mobx-react";
import { Fav } from "../stores/FavStore";
import "./ListFavs.css";
import { Link } from "react-router-dom";

interface ListFavsProps {
    items: Fav[];
    show: boolean;
}

export const ListFavs = observer(({ items, show }: ListFavsProps) => {
    return show ? (
        <div className={"saved-items-toolbox"}>
            <div className={"card"}>
                <div className={"card-header"}>Saved Reports</div>
                <ul className={"list-group"}>
                    {items.map((value) => {
                        return (
                            <li>
                                <Link onClick={() => {}} to={"/report/" + value.name}>
                                    {value.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    ) : null;
});
