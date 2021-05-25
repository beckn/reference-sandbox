import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  NewPlatformRegistration,
  RegisteredPlatformsList,
  PlatformDetailsPage,
  EditPlatformDetailsPage,
  NetworkSettingsPage,
  LoginPage,
  SecuredRoute,
  ChangePasswordPage,
  HomePage
} from "./containers";
import { AppNavbar } from "./components";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppNavbar />
        <Switch>
          <Route path="/login" 
            exact 
            component={LoginPage} />
          <SecuredRoute
            path="/"
            exact
            component={HomePage}
          />
          <SecuredRoute
            path="/platforms"
            exact
            component={RegisteredPlatformsList}
          />
          <SecuredRoute
            path="/newPlatform"
            exact
            component={NewPlatformRegistration}
          />
          <SecuredRoute
            path="/platform/:id"
            exact
            component={PlatformDetailsPage}
          />
          <SecuredRoute
            path="/editPlatform/:id"
            exact
            component={EditPlatformDetailsPage}
          />
          <SecuredRoute
            path="/networkSettings"
            exact
            component={NetworkSettingsPage}
          />
          <SecuredRoute
            path="/changePassword"
            exact
            component={ChangePasswordPage}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
