import React from "react";
import { Router } from "../router/Router";

export function AppView(props) {
  return (
    <div className="celeste block w-screen min-w-full max-w-full h-screen min-h-full max-h-full overflow-x-hidden overflow-y-auto">
      <div className="container mx-auto h-full min-h full max-h-full">
        <Router {...props} />
      </div>
    </div>
  );
}
