'use client';

import { useUserRole } from '@/hooks/use-user-role';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, Users, ArrowUpRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, DocumentData } from 'firebase/firestore';

interface Order {
  id: string;
  totalAmount: number;
}

export default function AdminDashboard() {
  const { isAdmin, isLoading: isRoleLoading } = useUserRole();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'orders'));
  }, [firestore, isAdmin]);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'users'));
  }, [firestore, isAdmin]);

  const { data: orders, isLoading: ordersLoading } = useCollection<Order>(ordersQuery);
  const { data: users, isLoading: usersLoading } = useCollection<DocumentData>(usersQuery);

  const totalRevenue = orders?.reduce((acc, order) => acc + order.totalAmount, 0) ?? 0;
  const totalUsers = users?.length ?? 0;


  useEffect(() => {
    if (isRoleLoading) return; // Wait until role check is complete

    try {
      const secretVerified = sessionStorage.getItem('admin-secret-verified') === 'true';
      if (!secretVerified) {
        router.replace('/admin/secret');
        return;
      }
      if (!isAdmin) {
        router.replace('/');
        return;
      }
      setIsVerified(true);
    } catch (error) {
       // This can happen if sessionStorage is not available (e.g., SSR, secure browser settings)
       router.replace('/admin/secret');
    }
  }, [isAdmin, isRoleLoading, router]);

  if (isRoleLoading || !isVerified || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const recentOrders = [
    { id: 'ORD001', customer: 'Liam Johnson', avatar: 'https://i.pravatar.cc/150?u=liam', status: 'Delivered', total: 250.00 },
    { id: 'ORD002', customer: 'Olivia Smith', avatar: 'https://i.pravatar.cc/150?u=olivia', status: 'Shipped', total: 150.00 },
    { id: 'ORD003', customer: 'Noah Williams', avatar: 'https://i.pravatar.cc/150?u=noah', status: 'Processing', total: 350.00 },
    { id: 'ORD004', customer: 'Emma Brown', avatar: 'https://i.pravatar.cc/150?u=emma', status: 'Pending', total: 450.00 },
    { id: 'ORD005', customer: 'Ava Jones', avatar: 'https://i.pravatar.cc/150?u=ava', status: 'Canceled', total: 550.00 },
  ]
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-muted/30">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hello, Admin</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
               <div className="text-4xl font-bold animate-pulse">...</div>
            ) : (
              <div className="text-4xl font-bold">${totalRevenue.toFixed(2)}</div>
            )}
            <p className="text-xs text-primary/80">Calculated from all orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
               <div className="text-4xl font-bold animate-pulse">...</div>
            ) : (
            <div className="text-4xl font-bold">+{orders?.length ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {usersLoading ? (
               <div className="text-4xl font-bold animate-pulse">...</div>
            ) : (
            <div className="text-4xl font-bold">+{totalUsers}</div>
            )}
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Create Invoice</CardTitle>
             <p className="text-sm text-muted-foreground">Feature coming soon.</p>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Invoice form will be here.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
             <CardTitle>Recent Orders</CardTitle>
             <Button variant="ghost" size="sm" asChild>
                <Link href="#">View All</Link>
             </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {recentOrders.slice(0,4).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={order.avatar} alt={order.customer} />
                          <AvatarFallback>{getInitials(order.customer)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{order.customer}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
