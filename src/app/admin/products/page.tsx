'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Icons } from '@/components/common/icons';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive('Price must be positive')),
  stock: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().min(0, 'Stock cannot be negative')),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('name'));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const openAddDialog = () => {
    setEditingProduct(null);
    reset({ name: '', description: '', price: 0, stock: 0, category: '', brand: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!firestore) return;
    try {
      if (editingProduct) {
        // Update existing product
        const productRef = doc(firestore, 'products', editingProduct.id);
        await updateDoc(productRef, data);
        toast({ title: 'Success', description: 'Product updated successfully.' });
      } else {
        // Add new product
        // Note: For a real app, image upload would be handled here.
        // We'll use a placeholder for now.
        const newProductData = {
          ...data,
          slug: data.name.toLowerCase().replace(/\s+/g, '-'),
          rating: 0,
          reviewsCount: 0,
          image: { id: "placeholder", imageUrl: 'https://placehold.co/600x600', description: 'placeholder', imageHint: 'product placeholder' },
          gallery: [],
          specifications: {},
          features: []
        };
        await addDoc(collection(firestore, 'products'), newProductData);
        toast({ title: 'Success', description: 'Product added successfully.' });
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save product.' });
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
     if (!firestore) return;
     try {
       await deleteDoc(doc(firestore, "products", productId));
       toast({ title: 'Success', description: 'Product deleted successfully.' });
     } catch (error) {
       console.error('Error deleting product:', error);
       toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete product.' });
     }
  };


  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading products...</TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center">No products found.</TableCell>
                </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.image.imageUrl}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                     <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                               <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                     </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" step="0.01" {...register('price')} />
                   {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" {...register('stock')} />
                  {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" {...register('category')} />
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" {...register('brand')} />
                  {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                 {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
