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
            <li className={"list-header"}>
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
                <FavItem edit={edit} item={item} store={new CountryStore(item.id)} />
            ))}
            {favStore.favorites.length === 0 && <li className={"item-text"}>Saved items will appear here</li>}
        </ul>
    );
});
