import type { AppProps } from "next/app";
import {
  MuiThemeProvider,
  CssBaseline,
  Container,
  Box,
} from "@material-ui/core";
import theme from "../theme";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container>
        <Box marginTop={1} marginBottom={1}>
          <Component {...pageProps} />
        </Box>
      </Container>
    </MuiThemeProvider>
  );
}
export default MyApp;
