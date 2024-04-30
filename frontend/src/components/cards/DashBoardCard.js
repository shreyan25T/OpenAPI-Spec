import React from 'react';
import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Avatar, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assests/TA-Logo.png";

function DashBoardCard({ title, description, icon, routeTo }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(routeTo);
  };

  return (
    <Card sx={{ maxWidth: 500 }}>
      <Avatar className="bg-white mt-4 ml-5" aria-label="comparison">
      <img src={icon} alt="comparison" style={{ height: 40, width: 40 }} />
      </Avatar>
      <CardHeader title={title} />
      <Divider variant="middle" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          variant="contained"
          color="secondary"
          className="w-full"
          onClick={handleButtonClick}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default DashBoardCard;
