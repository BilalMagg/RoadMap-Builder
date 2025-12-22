#!/bin/bash

# ==========================================
# SCRIPT: dto.sh (FIXED)
# DESCRIPTION: Generates Create, Update, and Response DTOs
# ==========================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ENTITY_NAME=$1
USER_PATH=$2

if [ -z "$ENTITY_NAME" ]; then
  echo -e "${RED}Error: Entity Name is required.${NC}"
  exit 1
fi

# 1. Path Setup
if [ -z "$USER_PATH" ]; then
  TARGET_DIR="../../backend/src/models/${ENTITY_NAME}"
else
  TARGET_DIR="$USER_PATH"
fi

if [ ! -d "$TARGET_DIR" ]; then
  echo -e "${RED}Error: Directory '$TARGET_DIR' does not exist.${NC}"
  exit 1
fi

# 2. Check for Metadata File
META_FILE="${TARGET_DIR}/.fields.temp"
HAS_META=false
if [ -f "$META_FILE" ]; then
  HAS_META=true
  echo -e "${GREEN}Found field definitions.${NC}"
fi

CLASS_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${ENTITY_NAME:0:1})${ENTITY_NAME:1}"
FILE_PATH="${TARGET_DIR}/${ENTITY_NAME}.dto.ts"

# 3. Initialize Variables
CREATE_CONTENT=""
UPDATE_CONTENT=""
RESPONSE_CONTENT=""
IMPORTS_LIST="IsString, IsInt, IsBoolean, IsDateString, IsOptional, IsNotEmpty"

process_field() {
  local F_NAME=$1
  local F_TYPE=$2
  local F_NULL=$3

  echo "------------------------------------------------"
  echo -e "Processing Field: ${GREEN}${F_NAME}${NC} (Type: ${F_TYPE})"
  
  # Interactive prompt works now because stdin is free
  read -p "Include in DTOs? (y/n) [y]: " INCLUDE
  INCLUDE=${INCLUDE:-y}

  if [ "$INCLUDE" != "y" ]; then
    return
  fi

  echo "Select Validator: 1)String 2)Int 3)Boolean 4)DateString 5)Email 6)UUID"
  read -p "Choice [1]: " V_CHOICE

  local VALIDATOR="@IsString()"
  
  case $V_CHOICE in
    2) VALIDATOR="@IsInt()";;
    3) VALIDATOR="@IsBoolean()";;
    4) VALIDATOR="@IsDateString()";;
    5) VALIDATOR="@IsEmail()"; IMPORTS_LIST="${IMPORTS_LIST}, IsEmail";;
    6) VALIDATOR="@IsUUID()"; IMPORTS_LIST="${IMPORTS_LIST}, IsUUID";;
  esac

  # Logic: Nullable in DB -> Optional in CreateDTO
  if [ "$F_NULL" == "y" ]; then
    CREATE_DEC="${VALIDATOR}
    @IsOptional()"
    CREATE_PROP="${F_NAME}?: ${F_TYPE}"
  else
    CREATE_DEC="${VALIDATOR}
    @IsNotEmpty()"
    CREATE_PROP="${F_NAME}!: ${F_TYPE}"
  fi
  
  CREATE_CONTENT="${CREATE_CONTENT}
    ${CREATE_DEC}
    ${CREATE_PROP};
"

  UPDATE_DEC="${VALIDATOR}
    @IsOptional()"
  UPDATE_CONTENT="${UPDATE_CONTENT}
    ${UPDATE_DEC}
    ${F_NAME}?: ${F_TYPE};
"

  RESPONSE_CONTENT="${RESPONSE_CONTENT}
    ${F_NAME}!: ${F_TYPE};
"
}

# 4. Main Loop (FIXED)
if [ "$HAS_META" = true ]; then
  # We read from File Descriptor 3 (<&3) to keep Stdin (0) free for prompts
  while IFS='|' read -r m_name m_type m_null <&3; do
    if [ -z "$m_name" ]; then continue; fi
    
    # Clean up the type string (remove ' | null')
    CLEAN_TYPE=${m_type//" | null"/}
    
    # Trim whitespace (just in case)
    m_null=$(echo "$m_null" | xargs) 

    process_field "$m_name" "$CLEAN_TYPE" "$m_null"
  done 3< "$META_FILE"
else
  echo -e "${YELLOW}No metadata found. Manual entry mode.${NC}"
  while true; do
    read -p "Field Name (ENTER to finish): " MANUAL_NAME
    if [ -z "$MANUAL_NAME" ]; then break; fi
    process_field "$MANUAL_NAME" "string" "n"
  done
fi

# 5. Generate File
cat <<EOT > "$FILE_PATH"
import { ${IMPORTS_LIST} } from 'class-validator';

export class Create${CLASS_NAME}Dto {
${CREATE_CONTENT}
}

export class Update${CLASS_NAME}Dto {
${UPDATE_CONTENT}
}

export class Response${CLASS_NAME}Dto {
    id!: number;
${RESPONSE_CONTENT}
    createdAt!: Date;
    updatedAt!: Date;
}
EOT

echo -e "${GREEN}✔ DTOs generated: ${FILE_PATH}${NC}"