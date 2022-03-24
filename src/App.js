import React from "react";
import jwtDecode from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Login,
  Workouts,
  CreateWorkout,
  Register,
} from "./components";
import ViewWorkout from "./components/Workouts/ViewWorkout";
import EditWorkout from "./components/Workouts/EditWorkout";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: { userId: -1, userName: "" },
      token: "",
    };

    this.setToken = this.setToken.bind(this);
    this.getToken = this.getToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  getToken() {
    const tokenString = sessionStorage.getItem("token");
    if (tokenString) {
      let decoded = jwtDecode(tokenString);
      this.setState({
        currentUser: { userId: decoded.userId, userName: decoded.userName },
        token: tokenString,
      });
    }
  }

  setToken(token) {
    let decoded = jwtDecode(token.token);
    sessionStorage.setItem("token", JSON.stringify(token));
    this.setState({
      currentUser: { userId: decoded.userId, userName: decoded.userName },
      token: token.token,
    });
  }

  logout() {
    sessionStorage.removeItem("token");
    this.setState({
      currentUser: { userId: -1, userName: "" },
      token: "",
    });
  }

  componentDidMount() {
    this.getToken();
  }

  render() {
    if (!this.state.token) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Login setToken={this.setToken} />} />
            <Route
              path="/register"
              element={<Register setToken={this.setToken} />}
            />
          </Routes>
        </BrowserRouter>
      );
    }

    return (
      <div className="mx-auto max-w-4xl">
        <div className="m-2">
          <h1 className="text-center my-4">GRIT Workout Recommender System</h1>
          <div className="grid grid-cols-2 content-between">
            <div>
              <h2 className="my-2">
                Current User:{" "}
                {this.state.currentUser.userName === ""
                  ? "N/A"
                  : this.state.currentUser.userName}
              </h2>
            </div>
            <div className="justify-self-end self-center">
              <button
                onClick={() => this.logout()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold p-1 rounded shadow cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>

          <BrowserRouter>
            <Routes>
              <Route
                path="/workouts"
                element={<Workouts currentUser={this.state.currentUser} />}
              />
              <Route path="/workouts/new" element={<CreateWorkout />} />
              <Route path="/workouts/:id" element={<ViewWorkout />} />
              <Route path="/workouts/:id/edit" element={<EditWorkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/*" element={<h1>404 Page not found</h1>} />
            </Routes>
          </BrowserRouter>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

export default App;
