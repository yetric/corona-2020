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

export const Material: ColorTheme = createTheme({
    blue: "#2196F3",
    red: "#F44336",
    green: "#4CAF50",
    orange: "#FF9800",
    yellow: "#FFEB3B",
    purple: "#673AB7",

    bg: "#272822",
    fg: "#F8F8F2"
});

export const CoronaTheme: ColorTheme = createTheme();
export const Gruvbox: ColorTheme = createTheme({
    blue: "#458588",
    red: "#cc241d",
    green: "#b8bb26",
    orange: "#fe8019",
    yellow: "#fabd2f",
    purple: "#d3869b",

    bg: "#282828",
    fg: "#ebdbb2"
});

export const Dracula: ColorTheme = createTheme({
    blue: "#6272a4",
    red: "#ff5555",
    green: "#50fa7b",
    yellow: "#f1fa8c",
    purple: "#bd93f9",

    bg: "#282a36",
    fg: "#f8f8f2"
});

export const colors = [Gruvbox.blue, Gruvbox.red, Gruvbox.green, Gruvbox.yellow];

export const { blue, red, green, yellow, purple, orange } = Gruvbox;

export const gray = "#BDBDBD";
export const pink = "#ef71d8";
