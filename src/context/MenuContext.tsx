import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type MenuItemDB = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
  category_label: string;
  category_blurb: string;
  is_veg: boolean;
  tags: string[];
  is_popular: boolean;
  sort_order: number;
};

export type MenuCategoryDB = {
  id: string;
  label: string;
  blurb: string;
  items: MenuItemDB[];
};

type MenuContextValue = {
  categories: MenuCategoryDB[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<MenuCategoryDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('menu_items')
      .select('*')
      .order('category_id')
      .order('sort_order');

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setLoading(false);
      return;
    }

    // Group by category
    const catMap = new Map<string, MenuCategoryDB>();
    (data as MenuItemDB[]).forEach((item) => {
      if (!catMap.has(item.category_id)) {
        catMap.set(item.category_id, {
          id: item.category_id,
          label: item.category_label,
          blurb: item.category_blurb,
          items: [],
        });
      }
      catMap.get(item.category_id)!.items.push(item);
    });

    // Sort categories in a logical order
    const categoryOrder = ['starters', 'main-course', 'desserts', 'beverages'];
    const sortedCategories = categoryOrder
      .map((id) => catMap.get(id))
      .filter((c): c is MenuCategoryDB => !!c);

    setCategories(sortedCategories);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return (
    <MenuContext.Provider value={{ categories, loading, error, refresh: fetchMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
