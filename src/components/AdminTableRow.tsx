import React from 'react';
import { IconButton, Tooltip, styled } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedIcon from '@mui/icons-material/Verified';

interface AdminTableRowProps {
  row: Record<string, React.ReactNode>;
  onEdit?: () => void;
  onDelete?: () => void;
  onBan?: () => void;
  onVerify?: () => void;
  showActions?: boolean;
  verified?: boolean;
}

const StyledTableRow = styled('tr')(({ theme }) => ({
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(1, 237, 196, 0.05)' : 'rgba(1, 237, 196, 0.02)',
  },
}));

const AdminTableRow: React.FC<AdminTableRowProps> = ({ 
  row, 
  onEdit, 
  onDelete, 
  onBan, 
  onVerify,
  showActions = true,
  verified = false
}) => {
  return (
    <StyledTableRow>
      {Object.values(row).map((cell, index) => (
        <td key={index} style={{
          padding: '12px 16px',
          textAlign: 'left',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '300px',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          {cell}
        </td>
      ))}
      {showActions && (
        <td style={{
          padding: '8px 16px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
            {onVerify && (
              <Tooltip title={verified ? "Verified" : "Verify"}>
                <IconButton 
                  onClick={onVerify} 
                  size="small" 
                  sx={{
                    backgroundColor: verified ? 'rgba(1, 237, 196, 0.2)' : 'rgba(1, 237, 196, 0.1)',
                    color: verified ? '#01EDC4' : 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'rgba(1, 237, 196, 0.3)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  <VerifiedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip title="Edit">
                <IconButton 
                  onClick={onEdit} 
                  size="small" 
                  sx={{
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    color: '#007BFF',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 123, 255, 0.2)',
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
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    color: '#DC3545',
                    '&:hover': {
                      backgroundColor: 'rgba(220, 53, 69, 0.2)',
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
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    color: '#FFC107',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 193, 7, 0.2)',
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
    </StyledTableRow>
  );
};

export default AdminTableRow;