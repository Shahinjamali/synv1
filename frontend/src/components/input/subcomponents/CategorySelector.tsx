'use client';

import { useFormContext } from 'react-hook-form';
import { Category } from '@/types/category';

interface CategorySelectorProps {
  modelType: 'product' | 'service' | 'category';
  categories: Category[];
  subcategories: Category[];
}

export const CategorySelector = ({
  modelType,
  categories,
  subcategories,
}: CategorySelectorProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const isSubcategory = watch('isSubcategory');

  return (
    <>
      {modelType !== 'category' && (
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category<span className="text-danger ms-1">*</span>
          </label>
          <select
            id="category"
            className={`form-select ${errors.category ? 'is-invalid' : ''}`}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select...</option>
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
            <div className="invalid-feedback">
              {' '}
              {typeof errors.category?.message === 'string' &&
                errors.category.message}
            </div>
          )}
        </div>
      )}
      {modelType === 'product' && (
        <div className="mb-3">
          <label htmlFor="subcategory" className="form-label">
            Subcategory<span className="text-danger ms-1">*</span>
          </label>
          <select
            id="subcategory"
            className={`form-select ${errors.subcategory ? 'is-invalid' : ''}`}
            {...register('subcategory', {
              required: 'Subcategory is required',
            })}
          >
            <option value="">Select...</option>
            {subcategories.map((sc) => (
              <option key={sc._id} value={sc._id}>
                {sc.title}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <div className="invalid-feedback">
              {' '}
              {typeof errors.subcategory?.message === 'string' &&
                errors.subcategory.message}
            </div>
          )}
        </div>
      )}
      {modelType === 'category' && (
        <>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="isSubcategory"
              className="form-check-input"
              {...register('isSubcategory')}
            />
            <label htmlFor="isSubcategory" className="form-check-label">
              Is Subcategory
            </label>
          </div>
          {isSubcategory && (
            <div className="mb-3">
              <label htmlFor="parent" className="form-label">
                Parent Category
              </label>
              <select
                id="parent"
                className={`form-select ${errors.parent ? 'is-invalid' : ''}`}
                {...register('parent')}
              >
                <option value="">Select...</option>
                {categories
                  .filter((c) => !c.isSubcategory)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
              </select>
              {errors.parent && (
                <div className="invalid-feedback">
                  {' '}
                  {typeof errors.parent?.message === 'string' &&
                    errors.parent.message}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};
