import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  CloudUpload,
  History,
  Assessment,
  Settings,
  Biotech,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ColorModeContext } from "../ColorModeContext.jsx";

const drawerWidth = 280;

export default function Sidebar() {
  const location = useLocation();
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  const navigationItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Upload & Analyze", icon: <CloudUpload />, path: "/upload" },
    { text: "Scan History", icon: <History />, path: "/history" },
    { text: "Reports & Analytics", icon: <Assessment />, path: "/reports" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Biotech sx={{ fontSize: 28, color: "primary.main" }} />
        <Typography variant="h6" fontWeight={600} color="primary.main">
          RadiologyAI
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ py: 2 }}>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={
              location.pathname === item.path ||
              (location.pathname === "/" && item.path === "/dashboard")
            }
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 2,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
                "& .MuiListItemIcon-root": { color: "white" },
              },
              "&:hover": {
                backgroundColor:
                  mode === "light" ? "action.hover" : "action.selected",
              },
            }}
          >
            <ListItemIcon sx={{ color: "text.secondary" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        ))}

        <div className="sidebar"
         style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",   // centers horizontally
    justifyContent: "flex-end", // pushes downward (bottom)
    height: "100%",         // full height sidebar
    paddingBottom: "2rem"   // adjust spacing downward
  }}
        >
          {/* Other menu items */}
          <Link to="/login">
            <button
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
              }}
               onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
  onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
            >
              Login
            </button>
          </Link>
        </div>
      </List>

      {/* Theme Toggle */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {mode === "light" ? (
              <LightMode fontSize="small" />
            ) : (
              <DarkMode fontSize="small" />
            )}
            <Typography variant="body2" color="text.secondary">
              {mode === "light" ? "Light Mode" : "Dark Mode"}
            </Typography>
          </Box>
          <Tooltip title="Toggle theme">
            <Switch
              checked={mode === "dark"}
              onChange={toggleColorMode}
              size="small"
            />
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
}
