'use client';

import { useUserRole } from '@/hooks/use-user-role';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, DollarSign, Package, ShoppingCart, Users, Bell, Search, PlusCircle } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { isAdmin, isLoading: isRoleLoading, user } = useUserRole();
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

  return (
    <div className="flex-1 p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Hello, {user?.displayName || 'Admin'}</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 bg-background" />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">$18,345</div>
                <p className="text-xs text-muted-foreground">November 2022</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">$15,634</div>
                <p className="text-xs text-muted-foreground">November 2022</p>
            </CardContent>
          </Card>
           <Card className="bg-pink-100/30 dark:bg-pink-900/20 border-pink-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">$12,643</div>
                <p className="text-xs text-muted-foreground">November 2022</p>
            </CardContent>
          </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Create Invoice</CardTitle>
                      <Button variant="ghost" size="icon">
                        <PlusCircle className="h-6 w-6"/>
                      </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Latest Transaction</p>
                    <div className="flex gap-4 mb-8">
                       <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                           <Avatar className="h-8 w-8">
                               <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                               <AvatarFallback>JR</AvatarFallback>
                           </Avatar>
                           <div>
                               <p className="text-sm font-medium">James Robert</p>
                               <p className="text-xs text-muted-foreground">jamesrobert@gmail.com</p>
                           </div>
                       </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                           <Avatar className="h-8 w-8">
                               <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704e" />
                               <AvatarFallback>JR</AvatarFallback>
                           </Avatar>
                           <div>
                               <p className="text-sm font-medium">James Robert</p>
                               <p className="text-xs text-muted-foreground">jamesrobert@gmail.com</p>
                           </div>
                       </div>
                       <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                           <Avatar className="h-8 w-8">
                               <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704f" />
                               <AvatarFallback>JR</AvatarFallback>
                           </Avatar>
                           <div>
                               <p className="text-sm font-medium">James Robert</p>
                               <p className="text-xs text-muted-foreground">jamesrobert@gmail.com</p>
                           </div>
                       </div>
                    </div>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <Input placeholder="Customer name" />
                           <Input type="email" placeholder="Customer email" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <Input placeholder="Item name" />
                           <Input placeholder="Item amount" type="number" />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <Button variant="outline">Add more details</Button>
                            <Button className="bg-foreground text-background hover:bg-foreground/80">Send Money</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>My Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-white rounded-xl p-6 space-y-8 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <p className="font-medium">John Demin</p>
                        <svg width="35" height="22" viewBox="0 0 35 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M34.5 11.24C34.5 17.18 26.78 22 17.25 22C7.72 22 0 17.18 0 11.24C0 5.3 7.72 0.5 17.25 0.5C26.78 0.5 34.5 5.3 34.5 11.24Z" fill="white" fillOpacity="0.2"/>
                        </svg>
                    </div>
                    <p className="text-3xl font-bold tracking-wider">$34,856.00</p>
                    <div className="flex justify-between items-end">
                        <p className="font-mono text-sm">3459 **** **** 4356</p>
                        <p className="text-xs">12/20 - 124</p>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transaction history</CardTitle>
                <Button variant="link" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src="https://i.pravatar.cc/150?u=tinder" />
                                <AvatarFallback>T</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Tinder</p>
                                <p className="text-sm text-muted-foreground">05 November 2022 at 7:30 PM</p>
                            </div>
                        </div>
                        <p className="font-semibold">$120.00</p>
                    </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border">
                                 <AvatarImage src="https://i.pravatar.cc/150?u=mailchimp" />
                                <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Mainchimp</p>
                                <p className="text-sm text-muted-foreground">10 November 2022 at 3:30 PM</p>
                            </div>
                        </div>
                        <p className="font-semibold">$230.00</p>
                    </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border">
                                 <AvatarImage src="https://i.pravatar.cc/150?u=github" />
                                <AvatarFallback>G</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Github</p>
                                <p className="text-sm text-muted-foreground">15 November 2022 at 11:30 PM</p>
                            </div>
                        </div>
                        <p className="font-semibold">$134.00</p>
                    </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border">
                                 <AvatarImage src="https://i.pravatar.cc/150?u=spotify" />
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">Spotify</p>
                                <p className="text-sm text-muted-foreground">20 November 2022 at 10:30 PM</p>
                            </div>
                        </div>
                        <p className="font-semibold">$432.00</p>
                    </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
