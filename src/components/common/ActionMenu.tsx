import React from "react";

import { Box, Menu, MenuItem } from "@mui/material";

import trashIcon from "../../assets/svg/trash.svg";
import pencilIcon from "../../assets/svg/pencil-square.svg";

import AppTypography from "./AppTypography";

interface ActionMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onEdit,
  onRemove,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          backgroundColor: "#27272A",
          color: "#fff",
          borderRadius: "10px",
          minWidth: 160,
        },
      }}
    >
      <MenuItem onClick={onEdit}>
        <Box
          component="img"
          src={pencilIcon}
          alt="edit"
          sx={{ width: 18, height: 18, mr: 1 }}
        />
        <AppTypography variant="body">Edit holdings</AppTypography>
      </MenuItem>
      <MenuItem onClick={onRemove} sx={{ color: "red" }}>
        <Box
          component="img"
          src={trashIcon}
          alt="trash"
          sx={{ width: 18, height: 18, mr: 1 }}
        />
        <AppTypography variant="body" color="#FDA4AF">
          Remove
        </AppTypography>
      </MenuItem>
    </Menu>
  );
};

export default ActionMenu;
