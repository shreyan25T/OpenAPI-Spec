import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#f7901d",
    },
  },
  shape: {
    borderRadius: 25,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "white",
          "&:hover": {
            color: "white",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "black", // Default font color for unselected tabs
          "&.Mui-selected": {
            color: "#F7901D", // Font color for selected tab
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          "& .MuiButton-root:hover": {
            color: "black",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#c1c1c1 #f1f1f1",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#f1f1f1",
            width: "9px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#c1c1c1",
            minHeight: 24,
            border: "3px solid #f1f1f1",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#f1f1f1",
          },
        },
      },
    },
  },
});

export default lightTheme;
