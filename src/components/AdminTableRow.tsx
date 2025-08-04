import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';

interface AdminTableRowProps {
  row: Record<string, React.ReactNode>; // dynamic row
  onEdit?: () => void;
  onDelete?: () => void;
  onBan?: () => void;
  showActions?: boolean;
}

const AdminTableRow: React.FC<AdminTableRowProps> = ({ row, onEdit, onDelete, onBan, showActions = true }) => {
  return (
    <tr className="hover:bg-gray-50 transition">
      {Object.values(row).map((cell, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
          {cell}
        </td>
      ))}
      {showActions && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton onClick={onEdit} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete">
              <IconButton onClick={onDelete} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onBan && (
            <Tooltip title="Ban">
              <IconButton onClick={onBan} size="small">
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </td>
      )}
    </tr>
  );
};

export default AdminTableRow;
