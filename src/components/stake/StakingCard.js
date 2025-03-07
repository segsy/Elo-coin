import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function StakingCard({ title, description }) {
  return (
    <Card
      sx={{
        boxShadow: "rgba(53, 69, 89, 0.05) 0px 2px 16px",
        marginBottom: "16px",
        textAlign: "center",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
}
