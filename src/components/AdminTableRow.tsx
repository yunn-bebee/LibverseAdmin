import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';

interface AdminTableRowProps {
  row: Record<string, React.ReactNode>;
  onEdit?: () => void;
  onDelete?: () => void;
  onBan?: () => void;
  showActions?: boolean;
}

const AdminTableRow: React.FC<AdminTableRowProps> = ({ row, onEdit, onDelete, onBan, showActions = true }) => {
  return (
    <tr style={{ position: 'relative', '&:hover': { backgroundColor: '#f8fafc' } }}>
      {Object.values(row).map((cell, index) => (
        <td key={index} style={{
          padding: '12px 16px',
          textAlign: 'left',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '300px',
          borderBottom: '1px solid rgba(224, 224, 224, 1)'
        }}>
          {cell}
        </td>
      ))}
      {showActions && (
        <td className="sticky-actions-cell" style={{
          padding: '8px 16px',
          textAlign: 'center',
          whiteSpace: 'nowrap',

          backgroundColor: '(rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
            {onEdit && (
              <Tooltip title="Edit">
                <IconButton 
                  onClick={onEdit} 
                  size="small" 
                  sx={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    '&:hover': {
                      backgroundColor: '#bae6fd',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete">
                <IconButton 
                  onClick={onDelete} 
                  size="small"
                  sx={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    '&:hover': {
                      backgroundColor: '#fecaca',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onBan && (
              <Tooltip title="Ban">
                <IconButton 
                  onClick={onBan} 
                  size="small"
                  sx={{
                    backgroundColor: '#ffedd5',
                    color: '#9a3412',
                    '&:hover': {
                      backgroundColor: '#fed7aa',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  <BlockIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default AdminTableRow;