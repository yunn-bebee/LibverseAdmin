import React from 'react';
import Table from '../../components/Table';
import AdminTableRow from '../../components/AdminTableRow';


const headers = ['Name', 'Email', 'Role'];

const data = [
  { name: 'Arthur', email: 'arthur@libverse.com', role: 'Admin' },
  { name: 'Bebee', email: 'bebee@libverse.com', role: 'Super Admin' },
];

const Dashboard: React.FC = () => {
  const handleEdit = (name: string) => {
    alert(`Edit user: ${name}`);
  };

  const handleDelete = (name: string) => {
    alert(`Delete user: ${name}`);
  };

  const handleBan = (name: string) => {
    alert(`Ban user: ${name}`);
  };

  return (
    <Table headers={headers} actions>
      {data.map((user, index) => (
        <AdminTableRow
          key={index}
          row={{ name: user.name, email: user.email, role: user.role }}
          onEdit={() => handleEdit(user.name)}
          onDelete={() => handleDelete(user.name)}
          onBan={() => handleBan(user.name)}
        />
      ))}
    </Table>
  );
};

export default Dashboard;
