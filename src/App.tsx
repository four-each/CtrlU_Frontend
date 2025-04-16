import { Global } from "@emotion/react";
import { globalStyles } from "@assets/styles/globalStyles";
import Router from "@routers/index";

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <Router />
    </>
  );
}

export default App;
