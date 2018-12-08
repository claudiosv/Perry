import React, { Component } from "react";
import teal from "@material-ui/core/colors/teal";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ClippedDrawer from "./ClippedDrawer";

const theme = createMuiTheme({
  palette: {
    primary: teal
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <ClippedDrawer />
      </MuiThemeProvider>
    );
  }
}
export default App;
