import { useParams } from 'react-router-dom';
import React from 'react';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="body px-4 mb-4">
      <span className="font-bold">{id}</span>
    </div>
  );
}

