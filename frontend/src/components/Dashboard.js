import React from "react";
import { Box } from "@mui/material";
import Navbar from "./navbar/Navbar";
import DashBoardCard from "./cards/DashBoardCard";
import pytestlogo from "../assests/pytest.png";
import locustlogo from "../assests/locust.png";
import seleniumlogo from "../assests/selenium.png";
import { useAuth0 } from "@auth0/auth0-react";

const elements = [
  {
    title: "Pytest",
    description: "Creates the pytest test files ",
    iconPath: pytestlogo,
    routeTo: "/home",
  },
  {
    title: "Locust Load",
    description: "Creates the locust test files",
    iconPath: locustlogo,
    routeTo: "/locust",
  },
  {
    title: "Selenium Test",
    description: "Creates the selenium test files ",
    iconPath: seleniumlogo,
    routeTo: "/selenium",
  },
];

const DashBoard = () => {
  const { user } = useAuth0();

  return (
    <React.Fragment>
      <Navbar />
      <div style={{ textAlign: "center" }}>
        <h3>Hi {user.name}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 justify-items-center mt-20">
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={"20px"}
          flexDirection={"row"}
        >
          {elements.map((element) => (
            <DashBoardCard
              key={element.title}
              title={element.title}
              description={element.description}
              icon={element.iconPath}
              routeTo={element.routeTo}
            />
          ))}
        </Box>
      </div>
    </React.Fragment>
  );
};

export default DashBoard;
