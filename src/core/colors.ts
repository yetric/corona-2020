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
    blue: "#81a1c1",
    red: "rgb(191, 97, 106)",
    green: "rgb(163, 190, 140)",
    yellow: "rgb(235, 203, 139)",
    orange: "rgb(208, 135, 112)",
    purple: "rgb(180, 142, 173)",
    bg: "#3b4252",
    fg: "#d8dee9"
});

export const Monokai: ColorTheme = createTheme({
    blue: "#66D9EF",
    red: "#F92672",
    green: "#A6E22E",
    orange: "#FD971F",
    yellow: "#E6DB74",
    purple: "#AE81FF",

    bg: "#272822",
    fg: "#F8F8F2"
});

export const CoronaTheme: ColorTheme = createTheme();

export const colors = [NordTheme.blue, NordTheme.red, NordTheme.green, NordTheme.yellow];

export const blue = colors[0];
export const red = colors[1];
export const green = colors[2];

export const yellow = "#FDD835";
export const orange = "#ef9b71";
export const gray = "#BDBDBD";
export const pink = "#ef71d8";
