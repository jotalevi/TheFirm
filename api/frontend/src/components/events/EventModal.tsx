"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Event {
  id?: number;
  slug: string;
  eventName: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  logoIrid: string;
  bannerIrid: string;
  templateIrid: string;
  cssIrid: string;
  public: boolean;
  companyId: number;
  companyName?: string;
}

interface Company {
  id: number;
  companyName: string;
}

interface EventModalProps {
  mode: 'create' | 'edit' | 'view';
  event?: Event;
  companies: Company[];
  onSave?: (event: Event) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export default function EventModal({ 
  mode, 
  event, 
  companies, 
  onSave, 
  onDelete, 
  children 
}: EventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Event>({
    slug: '',
    eventName: '',
    eventDescription: '',
    startDate: '',
    endDate: '',
    logoIrid: '',
    bannerIrid: '',
    templateIrid: '',
    cssIrid: '',
    public: true,
    companyId: 0
  });

  useEffect(() => {
    if (event && mode !== 'create') {
      setFormData({
        ...event,
        startDate: event.startDate ? event.startDate.split('T')[0] : '',
        endDate: event.endDate ? event.endDate.split('T')[0] : ''
      });
    } else if (mode === 'create') {
      setFormData({
        slug: '',
        eventName: '',
        eventDescription: '',
        startDate: '',
        endDate: '',
        logoIrid: '',
        bannerIrid: '',
        templateIrid: '',
        cssIrid: '',
        public: true,
        companyId: companies.length > 0 ? companies[0].id : 0
      });
    }
  }, [event, mode, companies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setIsOpen(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {mode === 'create' && 'Crear Evento'}
                {mode === 'edit' && 'Editar Evento'}
                {mode === 'view' && 'Ver Evento'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <Input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      disabled={isViewMode}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Empresa</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.companyId}
                      onChange={(e) => setFormData({...formData, companyId: Number(e.target.value)})}
                      disabled={isViewMode}
                      required
                    >
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Evento</label>
                  <Input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                    value={formData.eventDescription}
                    onChange={(e) => setFormData({...formData, eventDescription: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      disabled={isViewMode}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de Fin</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      disabled={isViewMode}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Logo IRID</label>
                    <Input
                      type="text"
                      value={formData.logoIrid}
                      onChange={(e) => setFormData({...formData, logoIrid: e.target.value})}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Banner IRID</label>
                    <Input
                      type="text"
                      value={formData.bannerIrid}
                      onChange={(e) => setFormData({...formData, bannerIrid: e.target.value})}
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Template IRID</label>
                    <Input
                      type="text"
                      value={formData.templateIrid}
                      onChange={(e) => setFormData({...formData, templateIrid: e.target.value})}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CSS IRID</label>
                    <Input
                      type="text"
                      value={formData.cssIrid}
                      onChange={(e) => setFormData({...formData, cssIrid: e.target.value})}
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.public}
                      onChange={(e) => setFormData({...formData, public: e.target.checked})}
                      disabled={isViewMode}
                    />
                    <span className="text-sm font-medium">Evento Público</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  
                  {mode === 'edit' && onDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Eliminar
                    </Button>
                  )}
                  
                  {!isViewMode && (
                    <Button type="submit">
                      {mode === 'create' ? 'Crear' : 'Guardar'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 