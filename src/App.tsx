import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import "./App.css";
import DataProvider, { DataContext } from "./components/DataProvider";
import Home from "./components/Home";
import LevelDetail from "./components/LevelDetail";
import Result from "./components/Result";

const LoadingWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const App: React.FC = () => {
  return (
    <DataProvider>
      <DataContext.Consumer>
        {props => {
          if (props.isLoading) {
            return (
              <LoadingWrapper>
                <ClipLoader />
              </LoadingWrapper>
            );
          }
          return (
            <MemoryRouter>
              <Switch>
                <Route exact path="/">
                  <div id="container">
                    <Home />
                  </div>
                </Route>
                <Route path="/level-detail/:id">
                  <div id="container">
                    <LevelDetail />
                  </div>
                </Route>
                <Route path="/result">
                  <Result />
                </Route>
              </Switch>
            </MemoryRouter>
          );
        }}
      </DataContext.Consumer>
    </DataProvider>
  );
};

export default App;
