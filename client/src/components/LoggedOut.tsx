import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

export default function LoggedOut() {
  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>👋 You have successfully logged out.</h2>
      <p style={{ marginTop: "20px" }}>
        Thanks for visiting Dreamalish.
      </p>

      <Button color="primary" tag={Link} to="/">
        Return to Login
      </Button>
    </div>
  );
}