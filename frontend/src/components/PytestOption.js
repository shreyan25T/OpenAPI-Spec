import React from "react";
import { Box } from "@mui/material";
import Navbar from "./navbar/Navbar";
import DashBoardCard from "./cards/DashBoardCard";
import pytestlogo from "../assests/pytest.png";
import { useAuth0 } from "@auth0/auth0-react";

const elements = [
  {
    title: "SPEC file Upload",
    description: "Upload OpenAPI spec file ",
    iconPath: pytestlogo,
    routeTo: "/home/spec",
  },
  {
    title: "Manual",
    description: "Enter individual option",
    iconPath: pytestlogo,
    routeTo: "/home/manual",
  },
];

const PytestOption = () => {
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

export default PytestOption;
