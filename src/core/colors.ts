export const colors = ["#66D9EF", "#F92672", "#A6E22E", "#efda71"];

export const blue = colors[0];
export const red = colors[1];
export const green = colors[2];

export const yellow = "#FDD835";
export const orange = "#ef9b71";
export const gray = "#BDBDBD";
export const pink = "#ef71d8";

interface ColorTheme {
    blue: string;
    red: string;
    green: string;
    yellow: string;
    orange: string;
    purple: string;
    pink: string;
    gray: string;

    bg: string;
    fg: string;

    action: string;
    anchor: string;
    actionLight: string;

    elevatedBg: string;
    elevatedBorder: string;

    bgTrans: string;
    shadow: string;
}

const noTheme: ColorTheme = {
    action: "",
    actionLight: "",
    anchor: "",
    bg: "",
    bgTrans: "",
    blue: "",
    elevatedBg: "",
    elevatedBorder: "",
    fg: "",
    gray: "",
    green: "",
    orange: "",
    pink: "",
    purple: "",
    red: "",
    shadow: "",
    yellow: ""
};

export const createTheme = (props: any = {}): ColorTheme => {
    return {
        ...noTheme,
        ...props
    };
};

export const NordTheme: ColorTheme = createTheme({
    blue: "rgb(94, 129, 172)",
    red: "rgb(191, 97, 106)",
    green: "rgb(163, 190, 140)",
    yellow: "rgb(235, 203, 139)",
    orange: "rgb(208, 135, 112)",
    bg: "#3b4252",
    fg: "#d8dee9"
});

export const Monokai: ColorTheme = createTheme({
    blue: "#66D9EF",
    red: "#F92672",
    green: "#A6E22E"
});

export const CoronaTheme: ColorTheme = createTheme();
