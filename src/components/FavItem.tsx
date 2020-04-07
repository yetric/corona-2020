import { Link } from "react-router-dom";
import { favStore } from "../stores/FavStore";
import { MinusSquare } from "react-feather";
import React from "react";
import { observer } from "mobx-react";
import { CountryStore } from "../stores/CountryStore";
import { toast } from "../core/toaster";

interface FavItemProp {
    edit: any;
    item: any;
    store: CountryStore;
}

export const FavItem = observer(({ edit, item, store }: FavItemProp) => {
    if (!store.confirmed) {
        return null;
    }
    let active = parseInt(store.confirmed) - (parseInt(store.recovered) + parseInt(store.deaths));
    let activeNr = isNaN(active) ? null : active;
    return (
        <tr key={item.id}>
            <td className={"important-column"}>
                <Link to={`/${item.id}`}>
                    {item.name} {item.province && <>({item.province})</>}
                </Link>
            </td>
            <td className={"text-right confirmed"}>{store.confirmed}</td>
            <td className={"text-right deaths"}>{store.deaths}</td>
            <td className={"text-right recovered"}>{store.recovered}</td>
            <td className={"text-right active"}>{activeNr}</td>
            {edit && (
                <td
                    onClick={(event) => {
                        event.preventDefault();
                        favStore.remove(item.id);
                        toast({
                            text: "Saved place removed from list",
                            duration: 1500
                        });
                    }}>
                    <MinusSquare size={16} />
                </td>
            )}
        </tr>
    );
});
