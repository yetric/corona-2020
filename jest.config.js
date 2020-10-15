module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["./src"],
    transform: { "\\.ts$": ["ts-jest"] },
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    globals: {
        tsConfig: {
            allowJs: true,
        },
    },
};
