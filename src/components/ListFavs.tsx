import React from "react";
import { observer } from "mobx-react";
import { Fav, favStore } from "../stores/FavStore";
import { Link } from "react-router-dom";

export const ListFavs = observer(() => {
    return (
        <ul className={"list-group"}>
            <li className={"list-header"}>Saved places</li>
            {favStore.favorites.map((item: Fav) => {
                return (
                    <li key={item.id}>
                        <Link to={`/${item.id}`}>
                            {item.name} {item.province && <small>({item.province})</small>}
                        </Link>
                    </li>
                );
            })}
            {favStore.favorites.length === 0 && <li className={"item-text"}>Saved items will appear here</li>}
        </ul>
    );
});
