'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
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
import { Icons } from '@/components/common/icons';

interface TaxonomyItem extends DocumentData {
  id: string;
  name: string;
}

function TaxonomyManager({ title, collectionName }: { title: string, collectionName: 'categories' | 'brands' }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newItemName, setNewItemName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, collectionName), orderBy('name'));
  }, [firestore, collectionName]);

  const { data: items, isLoading } = useCollection<TaxonomyItem>(itemsQuery);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !firestore) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, collectionName), { name: newItemName });
      toast({ title: 'Success', description: `${title} added successfully.` });
      setNewItemName('');
    } catch (error) {
      console.error(`Error adding ${title}:`, error);
      toast({ variant: 'destructive', title: 'Error', description: `Failed to add ${title}.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, collectionName, itemId));
      toast({ title: 'Success', description: `${title} deleted successfully.` });
    } catch (error) {
      console.error(`Error deleting ${title}:`, error);
      toast({ variant: 'destructive', title: 'Error', description: `Failed to delete ${title}.` });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Add, view, and delete product {title.toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddItem} className="flex items-center gap-2 mb-6">
          <Input
            placeholder={`New ${title}...`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !newItemName.trim()}>
            {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Add
          </Button>
        </form>

        <div className="space-y-2">
          {isLoading && <p>Loading...</p>}
          {items && items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <span className="font-medium">{item.name}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the {item.name} {title.slice(0, -1)}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
           {!isLoading && items?.length === 0 && <p className="text-sm text-center text-muted-foreground p-4">No {title.toLowerCase()} found.</p>}
        </div>
      </CardContent>
    </Card>
  );
}


export default function AdminTaxonomyPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Taxonomy Management</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TaxonomyManager title="Categories" collectionName="categories" />
        <TaxonomyManager title="Brands" collectionName="brands" />
      </div>
    </div>
  );
}
