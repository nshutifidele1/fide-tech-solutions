'use client';

import { useUserRole } from '@/hooks/use-user-role';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 7500 },
  ];
  
  const recentOrders = [
    { id: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', status: 'Delivered', total: '$250.00' },
    { id: 'ORD002', customer: 'Olivia Smith', date: '2023-11-22', status: 'Shipped', total: '$150.00' },
    { id: 'ORD003', customer: 'Noah Williams', date: '2023-11-21', status: 'Delivered', total: '$350.00' },
    { id: 'ORD004-B', customer: 'Emma Brown', date: '2023-11-20', status: 'Pending', total: '$450.00' },
    { id: 'ORD005', customer: 'Ava Jones', date: '2023-11-19', status: 'Delivered', total: '$550.00' },
  ]

  return (
    <div className="flex-1 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">An overview of your store's performance.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+123</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">296</div>
            <p className="text-xs text-muted-foreground">Total active products</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.date}</div>
                      </TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === 'Delivered' ? 'default' : 
                            order.status === 'Shipped' ? 'secondary' : 
                            'outline'
                          }
                          className={order.status === 'Delivered' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30' : ''}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
