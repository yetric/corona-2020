import React, { useState } from "react";
import { observer } from "mobx-react";
import { Fav, favStore } from "../stores/FavStore";
import { Link } from "react-router-dom";
import { Edit, MinusSquare } from "react-feather";

export const ListFavs = observer(() => {
    const [edit, canEdit] = useState(false);
    return (
        <ul className={"list-group"}>
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
            {favStore.favorites.map((item: Fav) => {
                return (
                    <li key={item.id}>
                        <Link to={`/${item.id}`}>
                            {item.name} {item.province && <small>({item.province})</small>}
                        </Link>
                        {edit && (
                            <span
                                onClick={(event) => {
                                    event.preventDefault();
                                    favStore.remove(item.id);
                                }}
                                className={"action"}>
                                <MinusSquare size={16} />
                            </span>
                        )}
                    </li>
                );
            })}
            {favStore.favorites.length === 0 && <li className={"item-text"}>Saved items will appear here</li>}
        </ul>
    );
});
