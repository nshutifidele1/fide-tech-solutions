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

export default function AdminDashboard() {
  const { isAdmin, isLoading: isRoleLoading } = useUserRole();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isRoleLoading) return;

    try {
      const secretVerified = sessionStorage.getItem('admin-secret-verified') === 'true';
      if (!secretVerified) {
        router.replace('/admin/secret');
      } else if (!isAdmin) {
        router.replace('/');
      } else {
        setIsVerified(true);
      }
    } catch (error) {
       router.replace('/admin/secret');
    } finally {
       setIsLoading(false);
    }
  }, [isAdmin, isRoleLoading, router]);

  if (isLoading || isRoleLoading || !isVerified || !isAdmin) {
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
            <div className="text-4xl font-bold">$45,231.89</div>
            <p className="text-xs text-primary/80">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">+123</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
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