import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Target, Type, AlignLeft, AlertCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { RoadmapApi } from '../../features/roadmap/services/roadmapApi';
import { RoadmapCategory } from '../../features/roadmap/types/roadmap.types';
import styles from './CreateRoadmapModal.module.css';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  category: z.nativeEnum(RoadmapCategory),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (roadmapId: string) => void;
}

export function CreateRoadmapModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoadmapModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ key: string; value: string }[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      form.reset();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const cats = await RoadmapApi.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const newRoadmap = await RoadmapApi.createRoadmap(
        values.title,
        values.description || undefined,
        values.category
      );
      onSuccess(newRoadmap.id);
      onClose();
    } catch (error) {
      console.error('Failed to create roadmap', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={styles.modalContent}>
        <DialogHeader className={styles.modalHeader}>
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-2xl">
              <Sparkles className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <DialogTitle className={styles.modalTitle}>Create Roadmap</DialogTitle>
          <DialogDescription className={styles.modalDescription}>
            Design your future. Define your learning path with precision and style.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={styles.formContainer}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }: { field: any }) => (
                  <FormItem className={styles.fieldItem}>
                    <FormLabel className={styles.fieldLabel}>
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Roadmap Title
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Frontend Masterclass 2024" 
                        className={styles.inputField} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className={styles.errorText}>
                      {form.formState.errors.title && <AlertCircle className="h-3 w-3" />}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }: { field: any }) => (
                  <FormItem className={styles.fieldItem}>
                    <FormLabel className={styles.fieldLabel}>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Career Path
                      </div>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={styles.selectTrigger}>
                          <SelectValue placeholder="Select your domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.key} value={cat.value}>
                            {cat.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className={styles.errorText}>
                      {form.formState.errors.category && <AlertCircle className="h-3 w-3" />}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }: { field: any }) => (
                  <FormItem className={styles.fieldItem}>
                    <FormLabel className={styles.fieldLabel}>
                      <div className="flex items-center gap-2">
                        <AlignLeft className="h-4 w-4" />
                        Aspiration (Optional)
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the goals and impact of this learning journey..."
                        className={`${styles.inputField} ${styles.textareaField}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={styles.errorText} />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className={styles.modalFooter}>
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Launch Roadmap
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
