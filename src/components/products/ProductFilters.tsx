'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface TaxonomyItem extends DocumentData {
  id: string;
  name: string;
}

interface ProductFiltersProps {
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    selectedBrand: string | null;
    setSelectedBrand: (brand: string | null) => void;
}

export default function ProductFilters({
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand
}: ProductFiltersProps) {
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'), orderBy('name'));
  }, [firestore]);

  const brandsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'brands'), orderBy('name'));
  }, [firestore]);

  const { data: categories, isLoading: categoriesLoading } = useCollection<TaxonomyItem>(categoriesQuery);
  const { data: brands, isLoading: brandsLoading } = useCollection<TaxonomyItem>(brandsQuery);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
  };

  return (
    <div className="p-4 rounded-lg border bg-card/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="font-headline text-lg font-semibold">Filters</h3>
            {(selectedCategory || selectedBrand) && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear Filters
                </Button>
            )}
        </div>
        <Separator className="my-4" />
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-sm mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                    {categoriesLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : 
                        categories?.map(cat => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                            >
                                {cat.name}
                            </Button>
                        ))
                    }
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-sm mb-2">Brand</h4>
                <div className="flex flex-wrap gap-2">
                    {brandsLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : 
                        brands?.map(brand => (
                            <Button
                                key={brand.id}
                                variant={selectedBrand === brand.name ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedBrand(selectedBrand === brand.name ? null : brand.name)}
                            >
                                {brand.name}
                            </Button>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  );
}
