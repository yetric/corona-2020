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
        <div className={"card"}>
            <div className="card-header">
                Saved places
                <span
                    className={"action"}
                    onClick={(event) => {
                        event.preventDefault();
                        canEdit(!edit);
                    }}>
                    <Edit size={16} />
                </span>
            </div>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Confirmed</th>
                            <th>Deaths</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favStore.favorites.map((item: Fav) => (
                            <FavItem key={item.id} edit={edit} item={item} store={new CountryStore(item.id)} />
                        ))}
                    </tbody>
                </table>
            </div>
            {favStore.favorites.length === 0 && (
                <div className={"card-body muted"}>Saved places will automagically appear here</div>
            )}
        </div>
    );
});
