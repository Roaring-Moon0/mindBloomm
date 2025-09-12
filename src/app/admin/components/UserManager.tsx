
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirestoreCollection } from '@/hooks/use-firestore';
import { banUser, unbanUser } from '@/services/config-service';
import { toast } from '@/hooks/use-toast';
import { Loader2, UserX, UserCheck, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserManager() {
  const { data: users, loading: usersLoading } = useFirestoreCollection('users');
  const { data: bannedList, loading: bannedLoading } = useFirestoreCollection('bannedUsers');

  const loading = usersLoading || bannedLoading;

  const isBanned = (email?: string) => {
      if (!email || !bannedList) return false;
      const bannedRecord = (bannedList as any[]).find(b => b.email === email);
      return bannedRecord && !bannedRecord.removed;
  }

  const getInitials = (emailOrName: string | null | undefined) => {
    if (!emailOrName) return "U";
    const nameParts = emailOrName.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return emailOrName.substring(0, 2).toUpperCase();
  }

  const handleBan = async (email?: string) => {
    if (!email) return;
    if (!confirm(`Are you sure you want to ban ${email}? They will no longer be able to log in.`)) return;
    try {
      await banUser(email);
      toast({ title: 'User Banned', description: `${email} has been banned.` });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not ban the user.' });
    }
  };

  const handleUnban = async (email?: string) => {
    if (!email) return;
    try {
      await unbanUser(email);
      toast({ title: 'User Unbanned', description: `${email} has been unbanned.` });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not unban the user.' });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View all registered users and manage their access.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 flex items-center justify-center text-muted-foreground gap-2"><Loader2 className="animate-spin h-5 w-5"/>Loading users...</div>
          ) : (users && users.length > 0) ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {(users as any[]).map((p: any) => (
                    <TableRow key={p.uid}>
                        <TableCell className="font-medium flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={p.photoURL || ''} alt={p.displayName || p.email} />
                                <AvatarFallback>{getInitials(p.displayName || p.email)}</AvatarFallback>
                            </Avatar>
                            {p.displayName ?? 'Anonymous'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{p.email}</TableCell>
                        <TableCell>
                            {isBanned(p.email) ? (
                                <Badge variant="destructive">Banned</Badge>
                            ) : (
                                <Badge variant="secondary">Active</Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                           {isBanned(p.email) ? (
                            <Button variant="outline" size="sm" onClick={() => handleUnban(p.email)}><UserCheck className="mr-2 h-4 w-4"/>Unban</Button>
                            ) : (
                            <Button variant="destructive" size="sm" onClick={() => handleBan(p.email)}><UserX className="mr-2 h-4 w-4"/>Ban</Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          ) : (
             <div className="text-center py-10 text-muted-foreground">
                <Users className="mx-auto h-12 w-12"/>
                <p className="mt-4">No registered users found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
