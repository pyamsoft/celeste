import React from "react";
import { Router } from "../router/Router";

export function AppView(props) {
  return (
    <div className="nook-link block overflow-hidden w-screen min-w-full max-w-full h-screen min-h-full max-h-full">
      <div className="container mx-auto h-full min-h full max-h-full overflow-hidden">
        <Router {...props} />
      </div>
    </div>
  );
}
