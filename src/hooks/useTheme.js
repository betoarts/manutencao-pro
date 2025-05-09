
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useTheme = (defaultTheme = 'light') => {
  const [theme, setTheme] = useState(defaultTheme);
  const { toast } = useToast();

  const applyTheme = useCallback((chosenTheme) => {
    setTheme(chosenTheme);
    document.documentElement.classList.toggle('dark', chosenTheme === 'dark');
  }, []);

  const fetchThemePreference = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'theme_preference')
        .single();

      if (error && error.code !== 'PGRST116') { 
        throw error;
      }
      
      if (data && data.value) {
        applyTheme(data.value);
      } else {
        applyTheme(defaultTheme);
      }
    } catch (error) {
      console.error('Error fetching theme preference:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar tema",
        description: "Não foi possível carregar a preferência de tema. Usando tema padrão.",
      });
      applyTheme(defaultTheme);
    }
  }, [applyTheme, defaultTheme, toast]);

  useEffect(() => {
    fetchThemePreference();
  }, [fetchThemePreference]);

  const updateThemePreference = async (newTheme) => {
    try {
      const { data: existingEntry, error: selectError } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', 'theme_preference')
        .single();
      
      if (selectError && selectError.code === 'PGRST116') { // Not found, insert
         const { error: insertError } = await supabase
          .from('app_settings')
          .insert({ key: 'theme_preference', value: newTheme, description: 'User interface theme preference (light, dark, system)', updated_at: new Date().toISOString() });
        if (insertError) throw insertError;
      } else if (selectError) { // Other select error
        throw selectError;
      } else { // Found, update
        const { error: updateError } = await supabase
          .from('app_settings')
          .update({ value: newTheme, updated_at: new Date().toISOString() })
          .eq('key', 'theme_preference');
        if (updateError) throw updateError;
      }
      applyTheme(newTheme); // Apply theme after successful save
    } catch (error) {
      console.error('Error updating theme preference:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar tema",
        description: "Não foi possível salvar sua preferência de tema.",
      });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updateThemePreference(newTheme);
  };

  return { theme, toggleTheme, fetchThemePreference };
};
  