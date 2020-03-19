import { Link } from "react-router-dom";
import { favStore } from "../stores/FavStore";
import { MinusSquare } from "react-feather";
import React from "react";
import { observer } from "mobx-react";
import { CountryStore } from "../stores/CountryStore";

interface FavItemProp {
    edit: any;
    item: any;
    store: CountryStore;
}

export const FavItem = observer(({ edit, item, store }: FavItemProp) => {
    return (
        <li key={item.id}>
            <Link to={`/${item.id}`}>
                {item.name} {item.province && <small>({item.province})</small>}
            </Link>
            <ul>
                <li>
                    Confirmed: <span className={"confirmed"}>{store.confirmed}</span>
                </li>
                <li className={"text-center"}>
                    Deaths: <span className={"deaths"}>{store.deaths}</span>
                </li>
                <li className={"text-right"}>
                    Recovered: <span className={"recovered"}>{store.recovered}</span>
                </li>
            </ul>
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
});
