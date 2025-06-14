
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, ListOrdered, Image } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  onImageUpload
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && value && !isInitialized) {
      editorRef.current.innerHTML = value;
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    
    // Force focus back to editor after command
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Small delay to ensure DOM is updated before reading content
    setTimeout(() => {
      updateContent();
    }, 10);
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    updateContent();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key for better list behavior
    if (e.key === 'Enter') {
      setTimeout(updateContent, 0);
    }
    
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('indent');
      setTimeout(updateContent, 0);
    }
    
    // Handle Shift+Tab for outdentation
    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('outdent');
      setTimeout(updateContent, 0);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  const handleFocus = () => {
    if (editorRef.current && editorRef.current.innerHTML === '') {
      editorRef.current.innerHTML = '';
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('bold')}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('italic')}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('underline')}
        >
          <Underline className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('insertUnorderedList')}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('insertOrderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImageClick}
        >
          <Image className="w-4 h-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[100px] p-3 focus:outline-none focus:ring-2 focus:ring-eemploi-primary focus:ring-offset-1"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        data-placeholder={placeholder}
        style={{
          minHeight: '100px',
          direction: 'ltr',
          textAlign: 'left'
        }}
        suppressContentEditableWarning={true}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        [contenteditable] li {
          margin: 5px 0;
          list-style-position: outside;
        }
        
        [contenteditable] ul li {
          list-style-type: disc;
        }
        
        [contenteditable] ol li {
          list-style-type: decimal;
        }
      `}</style>
    </div>
  );
};
