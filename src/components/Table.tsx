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
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: 'background.paper',
            maxHeight: maxHeight,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                        borderBottom: '1px solid rgba(224, 224, 224, 1)'
                    },
                    '& .MuiTableCell-head': {
                        fontWeight: '600',
                        backgroundColor: '#f8fafc',
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                        borderBottom: '2px solid rgba(224, 224, 224, 1)'
                    },
                    '& .sticky-actions': {
                        position: 'sticky',
                        right: 0,
                        backgroundColor: '#f8fafc',
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
                            <th key={header} style={{
                                padding: '12px 16px',
                                textAlign: 'left',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#64748b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                minWidth: '150px'
                            }}>
                                {header}
                            </th>
                        ))}
                        {actions && (
                            <th className="sticky-actions" style={{
                                padding: '12px 16px',
                                textAlign: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#64748b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                minWidth: '150px'
                            }}>
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