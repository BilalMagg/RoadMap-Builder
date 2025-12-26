import { useState, useRef, useEffect } from 'react';
import styles from './EditableTitle.module.css';

interface EditableTitleProps {
  initialTitle: string;
  onSave: (newTitle: string) => void;
  placeholder?: string;
}

export default function EditableTitle({ initialTitle, onSave, placeholder = 'Untitled' }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (title.trim() === '') {
      setTitle(initialTitle); // Revert if empty
    } else if (title !== initialTitle) {
      onSave(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={styles.container}>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={styles.input}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1
        className={styles.title}
        onClick={() => setIsEditing(true)}
        title="Click to edit"
      >
        {title}
      </h1>
    </div>
  );
}
