import { favStore } from "../stores/FavStore";
import { trackEvent } from "../core/tracking";
import { toast } from "../core/toaster";
import { Save } from "react-feather";
import React from "react";

interface SaveBtnProps {
    id: number;
    countryName: string;
    provinceName?: string;
}

export const SaveBtn = ({ id, countryName, provinceName }: SaveBtnProps) => (
    <a
        href={"#save"}
        onClick={(event: any) => {
            event.preventDefault();
            favStore.save({
                id,
                name: countryName,
                province: provinceName
            });

            trackEvent({
                category: "Fav",
                action: "Save",
                label: countryName
            });

            toast({
                text: "Saved " + countryName + " for quick access"
            });
        }}
        className={"btn btn-block"}>
        <Save size={16} /> Save {countryName} {provinceName}
    </a>
);
