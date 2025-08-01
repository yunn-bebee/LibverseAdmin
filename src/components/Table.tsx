import React from 'react';
import { Table as MTTable, type TableProps } from '@mui/material';

interface CustomTableProps extends TableProps {
    headers: string[];
    children: React.ReactNode;
    actions?: React.ReactNode; // Optional actions prop
}

const Table: React.FC<CustomTableProps> = ({ headers, children, actions, ...props }) => {
    return (
        <MTTable {...props} className="w-full bg-white rounded-xl shadow-lg overflow-x-auto">
            <thead className="bg-gray-50">
                <tr>
                    {headers.map((header) => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {header}
                        </th>
                    ))}
                    {actions && (
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    )}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {/* 
                    You can pass actions as a prop to children if children are React elements.
                    Example usage:
                    <Table headers={...} actions={<YourActions />}>
                        {rows.map(row => <TableRow {...row} actions={actions} />)}
                    </Table>
                */}
                {children}
            </tbody>
        </MTTable>
    );
};

export default Table;