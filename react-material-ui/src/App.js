import React, { Component } from "react";
import NavBar from "./NavBar";
import teal from "@material-ui/core/colors/teal";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import ClippedDrawar from "./ClippedDrawar";

const theme = createMuiTheme({
  palette: {
    primary: teal
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <ClippedDrawar />
        </div>
      </MuiThemeProvider>
    );
  }
}
export default App;
