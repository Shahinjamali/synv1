#!/bin/bash

# Array of component names
components=("Banner" "Blog" "Services" "Services2" "About" "Slidingtext" "Project" "Pricing" "Whychoose" "Counter" "Brand" "Faq" "Contact" "Testimonial" "Cta")

# Function to create a .tsx file with a basic React component
create_tsx_component() {
  local filename="$1.tsx"
  local component_name="$1"

  cat <<EOF > "$filename"
import React from 'react';

interface ${component_name}Props {
  // Define your component props here (if any)
}

const ${component_name}: React.FC<${component_name}Props> = ({ /* Destructure props here */ }) => {
  return (
    <div>
      {/* Your component content */}
      <p>This is ${component_name}.tsx</p>
    </div>
  );
};

export default ${component_name};
EOF

  echo "Created $filename"
}

# Loop through the components array and create files
for component in "${components[@]}"; do
  create_tsx_component "$component"
done

echo "All component files created."