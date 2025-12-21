#!/bin/bash

# ==============================================================================
# Model Structure Generator
# Usage: Execute from the ./scripts/ folder
# ==============================================================================

# 1. Define the target base directory relative to the ./scripts folder
# We go up one level (..) then into backend/src/models
BASE_DIR="../backend/src/models"

# 2. Prompt the user for the model name
echo "--------------------------------------------------------"
echo "Create New Model Structure"
echo "--------------------------------------------------------"
read -p "Enter model name (singular, e.g., 'user'): " INPUT_NAME

# 3. Sanitize input: Convert to lowercase
MODEL_NAME=$(echo "$INPUT_NAME" | tr '[:upper:]' '[:lower:]')

# Validate input
if [ -z "$MODEL_NAME" ]; then
  echo "Error: Model name cannot be empty."
  exit 1
fi

# Define the specific model path
MODEL_PATH="$BASE_DIR/$MODEL_NAME"

echo "Target Directory: $MODEL_PATH"
echo "--------------------------------------------------------"

# 4. Create Directories
# mkdir -p creates the directory if it doesn't exist, and does nothing if it does.
mkdir -p "$MODEL_PATH"
mkdir -p "$MODEL_PATH/Itest"
mkdir -p "$MODEL_PATH/Utest"
mkdir -p "$MODEL_PATH/interface"

# 5. Function to create file if it doesn't exist
create_file_safely() {
    local filepath=$1
    
    if [ -f "$filepath" ]; then
        echo "⚠️  [SKIP] Exists: $(basename "$filepath")"
    else
        touch "$filepath"
        echo "✅ [CREATE] Done:   $(basename "$filepath")"
    fi
}

# 6. Helper Function: Create test file with Jest Boilerplate
create_test_file() {
    local filepath=$1
    local name=$2        # e.g., user
    local module=$3      # e.g., controller
    local test_type=$4   # e.g., unit or integration
    
    if [ -f "$filepath" ]; then
        echo "⚠️  [SKIP] Exists: $(basename "$filepath")"
    else
        # Write the Jest boilerplate content
cat <<EOF > "$filepath"
describe("$name $module $test_type tests", () => {
  it("init test", () => {
    expect(1).toBe(1);
  });
});
EOF
        echo "✅ [CREATE] Done:   $(basename "$filepath") (with boilerplate)"
    fi
}

# 7. Generate Files
# --- Root Level ---
create_file_safely "$MODEL_PATH/$MODEL_NAME.controller.ts"
create_file_safely "$MODEL_PATH/$MODEL_NAME.dto.ts"
create_file_safely "$MODEL_PATH/$MODEL_NAME.entity.ts"
create_file_safely "$MODEL_PATH/$MODEL_NAME.registry.ts"
create_file_safely "$MODEL_PATH/$MODEL_NAME.repository.ts"
create_file_safely "$MODEL_PATH/$MODEL_NAME.route.ts"
create_file_safely "$MODEL_PATH/$MODEL_NAME.service.ts"

# --- Interface ---
create_file_safely "$MODEL_PATH/interface/$MODEL_NAME.interface.ts"

# --- Unit Tests (Utest) ---
create_test_file "$MODEL_PATH/Utest/$MODEL_NAME.controller.test.ts" "$MODEL_NAME" "controller" "unit"
create_test_file "$MODEL_PATH/Utest/$MODEL_NAME.service.test.ts" "$MODEL_NAME" "service" "unit"
create_test_file "$MODEL_PATH/Utest/$MODEL_NAME.repository.test.ts" "$MODEL_NAME" "repository" "unit"

# --- Integration Tests (Itest) ---
create_test_file "$MODEL_PATH/Itest/$MODEL_NAME.controller.integration.test.ts" "$MODEL_NAME" "controller" "integration"

echo "--------------------------------------------------------"
echo "🎉 Structure generation complete for '$MODEL_NAME'"