interface ModelSelectorProps {
  modelType: 'product' | 'service' | 'category';
  setModelType: (type: 'product' | 'service' | 'category') => void;
}

export const ModelSelector = ({
  modelType,
  setModelType,
}: ModelSelectorProps) => {
  return (
    <div className="mb-3">
      <label htmlFor="modelType" className="form-label">
        Data Type
      </label>
      <select
        id="modelType"
        className="form-select"
        value={modelType}
        onChange={(e) =>
          setModelType(e.target.value as 'product' | 'service' | 'category')
        }
      >
        <option value="category">Category</option>
        <option value="product">Product</option>
        <option value="service">Service</option>
      </select>
      <small className="form-text text-muted">
        Choose what type of data to create.
      </small>
    </div>
  );
};
