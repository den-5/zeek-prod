"use client";

import { Provider } from "react-redux";
import store from "../../redux/store";
import RouteChangeHandler from "../../hoc/RouteChangeHandler";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <RouteChangeHandler />
      {children}
    </Provider>
  );
}
