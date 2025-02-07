import { extendTheme } from "@chakra-ui/react";
const theme = extendTheme({
    fonts: {
        heading: `'Roboto', sans-serif`,
    },
    textStyles: {
        h1: {
            fontSize: "4xl",
        },
        h2: {
            fontSize: "3xl",
        },
        h3: {
            fontSize: "2xl",
        },
    },
});

export default theme;