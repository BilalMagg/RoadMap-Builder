#!/bin/bash

# ==========================================
# SCRIPT: entity.sh
# DESCRIPTION: Generates a TypeORM Entity file
# ==========================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Inputs
ENTITY_NAME=$1
USER_PATH=$2

if [ -z "$ENTITY_NAME" ]; then
  echo -e "${RED}Error: Entity Name is required.${NC}"
  echo "Usage: ./entity.sh <entity_name> [optional_path]"
  exit 1
fi

# Define the Target Directory
if [ -z "$USER_PATH" ]; then
  TARGET_DIR="../../backend/src/models/${ENTITY_NAME}"
else
  TARGET_DIR="$USER_PATH"
fi

# 2. Directory Check
if [ ! -d "$TARGET_DIR" ]; then
  echo -e "${RED}Error: Directory '$TARGET_DIR' does not exist.${NC}"
  exit 1
fi

# 3. File Setup
CLASS_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${ENTITY_NAME:0:1})${ENTITY_NAME:1}"
FILE_NAME="${ENTITY_NAME}.entity.ts"
FILE_PATH="${TARGET_DIR}/${FILE_NAME}"

echo -e "${YELLOW}--- Configuring Entity: ${CLASS_NAME} ---${NC}"
echo -e "Target File: ${FILE_PATH}"

# 4. Table Name
DEFAULT_TABLE_NAME="${ENTITY_NAME}s"
read -p "Enter SQL Table Name [default: ${DEFAULT_TABLE_NAME}]: " TABLE_NAME
TABLE_NAME=${TABLE_NAME:-$DEFAULT_TABLE_NAME}

# 5. Attributes Loop
COLUMNS_CODE=""
IMPORTS_LIST="Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn"

echo -e "${YELLOW}Add columns (Press ENTER on 'Column Name' to finish).${NC}"

while true; do
  read -p "Column Name: " COL_NAME
  
  if [ -z "$COL_NAME" ]; then
    break
  fi

  echo "Select Type: 1)String 2)Number 3)Boolean 4)Date 5)Text"
  read -p "Choice [1]: " TYPE_CHOICE

  # Variables to build the decorator
  DB_ARG=""       # e.g., 'int' or 'text'
  DB_OPTIONS=""   # e.g., default: false
  TS_TYPE="string"

  case $TYPE_CHOICE in
    2) # Number
      TS_TYPE="number"
      DB_ARG="'int'"
      ;;
    3) # Boolean
      TS_TYPE="boolean"
      DB_OPTIONS="default: false"
      ;;
    4) # Date
      TS_TYPE="Date"
      ;;
    5) # Text
      TS_TYPE="string"
      DB_ARG="'text'"
      ;;
    *) # String (Default)
      TS_TYPE="string"
      ;;
  esac

  # Nullable Check
  read -p "Is nullable? (y/n) [n]: " IS_NULLABLE
  if [ "$IS_NULLABLE" == "y" ]; then
     TS_TYPE="${TS_TYPE} | null"
     
     if [ -z "$DB_OPTIONS" ]; then
        DB_OPTIONS="nullable: true"
     else
        DB_OPTIONS="${DB_OPTIONS}, nullable: true"
     fi
  fi

  # Construct the Decorator String
  # Logic: Check if we have Args, Options, both, or neither
  if [ -n "$DB_ARG" ] && [ -n "$DB_OPTIONS" ]; then
      DECORATOR="@Column(${DB_ARG}, { ${DB_OPTIONS} })"
  elif [ -n "$DB_ARG" ]; then
      DECORATOR="@Column(${DB_ARG})"
  elif [ -n "$DB_OPTIONS" ]; then
      DECORATOR="@Column({ ${DB_OPTIONS} })"
  else
      DECORATOR="@Column()"
  fi

  echo "${COL_NAME}|${TS_TYPE}|${IS_NULLABLE}" >> "${TARGET_DIR}/.fields.temp"

  # Append to code block
  COLUMNS_CODE="${COLUMNS_CODE}
    ${DECORATOR}
    ${COL_NAME}!: ${TS_TYPE};
"
done

# 6. Generate Content
cat <<EOT > "$FILE_PATH"
import { ${IMPORTS_LIST} } from 'typeorm';

@Entity('${TABLE_NAME}')
export class ${CLASS_NAME} {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
${COLUMNS_CODE}
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
EOT

echo -e "${GREEN}✔ Entity generated: ${FILE_PATH}${NC}"