import React from "react";
import Banner from "./Banner/Banner";
import LoginWithGoogle from "@/components/LoginWithGoogle";
import Example from "./Example/Example";
import { Container } from "@/components/ui-library/container";

const HomeComponent = () => {
  return (
    <Container >
      <Banner />
      <Example />
      <LoginWithGoogle />
    </Container> 
  );
};

export default HomeComponent;
