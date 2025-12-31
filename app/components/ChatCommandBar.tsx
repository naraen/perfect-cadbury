'use client';

import { useState } from 'react';

type Props = {
  onCommand: (input: string) => void;
};

export default function ChatCommandBar({ onCommand }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;

    onCommand(value);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="add finish MVP today under Projects"
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '14px',
        }}
      />
    </form>
  );
}
