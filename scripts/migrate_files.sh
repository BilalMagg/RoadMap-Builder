#!/bin/bash

# 1. Create the new specific directories
echo "Creating directory structure..."
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/features/roadmap/components
mkdir -p src/routes

# 2. Create empty files for the UI Library (Shadcn/UI)
echo "Creating empty UI component files..."
ui_files=(
  "accordion.tsx" "alert-dialog.tsx" "alert.tsx" "aspect-ratio.tsx" 
  "avatar.tsx" "badge.tsx" "breadcrumb.tsx" "button.tsx" "calendar.tsx" 
  "card.tsx" "carousel.tsx" "chart.tsx" "checkbox.tsx" "collapsible.tsx" 
  "command.tsx" "context-menu.tsx" "dialog.tsx" "drawer.tsx" 
  "dropdown-menu.tsx" "form.tsx" "hover-card.tsx" "input-otp.tsx" 
  "input.tsx" "label.tsx" "menubar.tsx" "navigation-menu.tsx" 
  "pagination.tsx" "popover.tsx" "progress.tsx" "radio-group.tsx" 
  "resizable.tsx" "scroll-area.tsx" "select.tsx" "separator.tsx" 
  "sheet.tsx" "sidebar.tsx" "skeleton.tsx" "slider.tsx" "sonner.tsx" 
  "switch.tsx" "table.tsx" "tabs.tsx" "textarea.tsx" "toast.tsx"
)

for file in "${ui_files[@]}"; do
  touch "src/components/ui/$file"
done

# 3. Create empty files for Global Layout Components
# (Moving Layout, Logo, PathfinderLogo here)
echo "Creating empty Layout component files..."
touch src/components/layout/Layout.tsx
touch src/components/layout/Layout.module.css
touch src/components/layout/Logo.tsx
touch src/components/layout/Logo.module.css
touch src/components/layout/PathfinderLogo.tsx
touch src/components/layout/PathfinderLogo.module.css

# 4. Create empty files for the Roadmap Feature
# (Moving AnimatedRoadmap here)
echo "Creating empty Roadmap feature files..."
touch src/features/roadmap/components/AnimatedRoadmap.tsx
touch src/features/roadmap/components/AnimatedRoadmap.module.css
# Creating a barrel file for the roadmap feature to keep imports clean later
touch src/features/roadmap/index.ts

# 5. Create empty file for Protected Route
echo "Creating empty ProtectedRoute file..."
touch src/routes/ProtectedRoute.tsx

echo "------------------------------------------------"
echo "Structure created successfully."
echo "You can now copy your content into these files."