#!/bin/bash

# --- Configuration ---
# Set the base directory for new features
FEATURE_BASE_DIR="src/features"

# Define the required subdirectories
SUBDIRS=(
    "components"
    "pages"
    "services"
    "hooks"
    "types"
)

# --- Function to Check Usage ---
usage() {
    echo "Usage: $0 <feature_name>"
    echo "Example: $0 reviews"
    exit 1
}

# --- Main Script Logic ---

# Check if a feature name was provided
if [ -z "$1" ]; then
    usage
fi

# Convert the provided name to lowercase for the directory name
FEATURE_NAME_LOWER=$(echo "$1" | tr '[:upper:]' '[:lower:]')
FEATURE_DIR="$FEATURE_BASE_DIR/$FEATURE_NAME_LOWER"

# Check if the feature directory already exists
if [ -d "$FEATURE_DIR" ]; then
    echo "❌ Error: Feature directory '$FEATURE_DIR' already exists."
    exit 1
fi

echo "🚀 Creating new feature structure for: $FEATURE_NAME_LOWER"
echo "------------------------------------------------"

# 1. Create the root feature directory
mkdir -p "$FEATURE_DIR"
echo "✅ Created directory: $FEATURE_DIR"

# 2. Create the standard subdirectories
for dir in "${SUBDIRS[@]}"; do
    mkdir -p "$FEATURE_DIR/$dir"
    echo "✅ Created subdirectory: $dir"
done

# 3. Create common boilerplate files
# Note: You can customize the content of these files to pre-fill boilerplate code.

# Create index.ts (Barrel file)
touch "$FEATURE_DIR/index.ts"
echo "Created barrel file: $FEATURE_DIR/index.ts"

# Create a sample API service file (using .ts extension)
touch "$FEATURE_DIR/services/$FEATURE_NAME_LOWER.api.ts"
echo "Created API service: $FEATURE_DIR/services/$FEATURE_NAME_LOWER.api.ts"

# Create a sample hook file
touch "$FEATURE_DIR/hooks/use${FEATURE_NAME_LOWER^}.ts"
echo "Created hook file: $FEATURE_DIR/hooks/use${FEATURE_NAME_LOWER^}.ts"

# Create a sample type definition file
touch "$FEATURE_DIR/types/${FEATURE_NAME_LOWER}.type.ts"
echo "Created types file: $FEATURE_DIR/types/${FEATURE_NAME_LOWER}.type.ts"


echo "------------------------------------------------"
echo "✨ Success! Feature '$FEATURE_NAME_LOWER' created at $FEATURE_BASE_DIR"