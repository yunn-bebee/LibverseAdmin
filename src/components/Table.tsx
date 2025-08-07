import React from 'react';
import { Table as MTTable, Box, type TableProps } from '@mui/material';

interface CustomTableProps extends TableProps {
    headers: string[];
    children: React.ReactNode;
    actions?: boolean;
    maxHeight?: string | number;
}

const Table: React.FC<CustomTableProps> = ({ headers, children, actions, maxHeight = 'auto', ...props }) => {
    return (
        <Box sx={{
            width: '100%',
            overflow: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            backgroundColor: 'background.paper',
            maxHeight: maxHeight,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
            <MTTable
                {...props}
                sx={{
                    minWidth: '100%',
                    tableLayout: 'auto',
                    '& .MuiTableCell-root': {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px',
                        px: 2,
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    },
                    '& th': {  // Target all header cells
                        fontWeight: '600',
                        backgroundColor: '#FF00C8', // Explicit magenta color
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                        color: 'white', // White text for contrast
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        minWidth: '150px'
                    },
                    '& .sticky-actions': {
                        position: 'sticky',
                        right: 0,
                        backgroundColor: '#FF00C8', // Explicit magenta color
                        zIndex: 2,
                        backdropFilter: 'blur(4px)',
                        boxShadow: '-2px 0 4px rgba(0,0,0,0.05)'
                    },
                    '& .sticky-actions-cell': {
                        position: 'sticky',
                        right: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                        boxShadow: '-2px 0 4px rgba(0,0,0,0.05)'
                    }
                }}
            >
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>
                                {header}
                            </th>
                        ))}
                        {actions && (
                            <th className="sticky-actions" style={{ textAlign: 'center' }}>
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </MTTable>
        </Box>
    );
};

export default Table;