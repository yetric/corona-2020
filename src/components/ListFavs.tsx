import React, { useState } from "react";
import { observer } from "mobx-react";
import { Fav, favStore } from "../stores/FavStore";
import { Edit } from "react-feather";
import "./ListFavs.css";
import { FavItem } from "./FavItem";
import { CountryStore } from "../stores/CountryStore";

export const ListFavs = observer(() => {
    const [edit, canEdit] = useState(false);
    return (
        <ul className={"favs"}>
            <li key={"jeaderfavss"} className={"list-header"}>
                Saved places
                <span
                    className={"action"}
                    onClick={(event) => {
                        event.preventDefault();
                        canEdit(!edit);
                    }}>
                    <Edit size={16} />
                </span>
            </li>
            {favStore.favorites.map((item: Fav) => (
                <FavItem key={"fav-" + item.id} edit={edit} item={item} store={new CountryStore(item.id)} />
            ))}
            {favStore.favorites.length === 0 && (
                <li key={"sdf"} className={"item-text"}>
                    Saved items will appear here
                </li>
            )}
        </ul>
    );
});
