'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { Category } from '@/types/category';

interface CategorySelectorProps {
  modelType: 'product' | 'service' | 'category';
  categories: Category[];
  subcategories?: Category[]; // ✅ Now optional
}

export const CategorySelector = ({
  modelType,
  categories,
  subcategories = [],
}: CategorySelectorProps) => {
  const {
    register,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useFormContext();

  const isSubcategory = watch('isSubcategory');
  const selectedCategory = watch('category');

  // Reset parent fields when not a subcategory (for category model)
  useEffect(() => {
    if (modelType === 'category' && !isSubcategory) {
      setValue('parent', undefined, { shouldValidate: false });
      setValue('parentSlug', undefined, { shouldValidate: false });
    }
  }, [isSubcategory, setValue, modelType]);

  const filteredSubcategories = selectedCategory
    ? subcategories.filter(
        (sc) =>
          sc.scope === 'product' &&
          sc.parent &&
          sc.parent.toString() === selectedCategory
      )
    : [];

  return (
    <>
      {/* Category Selector */}
      {modelType !== 'category' && (
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category<span className="text-red-600 ms-1">*</span>
          </label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className="form-select"
          >
            <option value="">Select Category...</option>
            {categories
              .filter(
                (c) => !c.isSubcategory && (!c.scope || c.scope === modelType)
              )
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-600">
              {String(errors.category.message)}
            </p>
          )}
        </div>
      )}

      {/* Subcategory Selector (only for product) */}
      {modelType === 'product' && (
        <div className="mb-4">
          <label
            htmlFor="subcategory"
            className="block text-sm font-medium mb-1"
          >
            Subcategory<span className="text-red-600 ms-1">*</span>
          </label>
          <select
            id="subcategory"
            {...register('subcategory', {
              required:
                modelType === 'product' ? 'Subcategory is required' : false,
            })}
            className="form-select"
            disabled={filteredSubcategories.length === 0 || !selectedCategory}
          >
            <option value="">Select Subcategory...</option>
            {filteredSubcategories.map((sc) => (
              <option key={sc._id} value={sc._id}>
                {sc.title}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <p className="text-xs text-red-600">
              {String(errors.subcategory.message)}
            </p>
          )}
        </div>
      )}

      {/* For category management: define parent only when isSubcategory is true */}
      {modelType === 'category' && (
        <>
          <div className="mb-4 flex items-center">
            <Controller
              name="isSubcategory"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="isSubcategory"
                  className="h-4 w-4 mr-2"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <label htmlFor="isSubcategory" className="text-sm font-medium">
              Is Subcategory
            </label>
          </div>

          {isSubcategory && (
            <div className="mb-4">
              <label
                htmlFor="parent"
                className="block text-sm font-medium mb-1"
              >
                Parent Category<span className="text-red-600 ms-1">*</span>
              </label>
              <select
                id="parent"
                {...register('parent', {
                  required: isSubcategory ? 'Parent is required' : false,
                })}
                className="form-select"
              >
                <option value="">Select Parent Category...</option>
                {categories
                  .filter((c) => !c.isSubcategory)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
              </select>
              {errors.parent && (
                <p className="text-xs text-red-600">
                  {String(errors.parent.message)}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};
