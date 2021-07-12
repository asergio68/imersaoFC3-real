import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { createTheme } from "@material-ui/core";

const palette: PaletteOptions = {
  type: "light",
  primary: {
    main: "#242526",
    contrastText: "#FFCD00",
  },
  background: {
    default: "#FFCD00",
  },
};

const theme = createTheme({
  palette,
});

export default theme;
