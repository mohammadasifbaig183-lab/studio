'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MOCK_USERS = [
  { id: 'usr_1', name: 'John Doe', email: 'john.doe@example.com', role: 'Attendee', joined: '2025-08-15' },
  { id: 'usr_2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Attendee', joined: '2025-08-16' },
  { id: 'usr_3', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'Attendee', joined: '2025-08-18' },
  { id: 'usr_4', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Attendee', joined: '2025-08-20' },
  { id: 'usr_5', name: 'admin@gmail.com', email: 'admin@gmail.com', role: 'Admin', joined: '2025-08-12' },
];

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View and manage platform users.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Joined</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {MOCK_USERS.map((user) => (
                <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>
                            {user.role}
                        </Badge>
                    </TableCell>
                    <TableCell>{user.joined}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
