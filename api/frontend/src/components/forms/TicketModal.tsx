"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface TicketTier {
  id?: number;
  tierName: string;
  basePrice: number;
  entryAllowedFrom?: string;
  entryAllowedTo?: string;
  singleUse: boolean;
  singleDaily: boolean;
  tierPdfTemplateIrid?: string;
  tierMailTemplateIrid?: string;
  stockInitial: number;
  stockCurrent?: number;
  stockSold?: number;
  eventId?: number;
  eventName?: string;
}

interface TicketModalProps {
  mode: 'create' | 'edit' | 'view';
  ticket?: TicketTier;
  eventSlug: string;
  onSave?: (ticket: TicketTier) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

const initialErrors = {
  tierName: '',
  basePrice: '',
  stockInitial: '',
};

export default function TicketModal({ 
  mode, 
  ticket, 
  eventSlug,
  onSave, 
  onDelete, 
  children 
}: TicketModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<TicketTier>({
    tierName: '',
    basePrice: 0,
    entryAllowedFrom: '',
    entryAllowedTo: '',
    singleUse: false,
    singleDaily: false,
    tierPdfTemplateIrid: '',
    tierMailTemplateIrid: '',
    stockInitial: 0
  });
  const [errors, setErrors] = useState<{[key:string]: string}>(initialErrors);

  useEffect(() => {
    if (ticket && mode !== 'create') {
      setFormData({
        ...ticket,
        entryAllowedFrom: ticket.entryAllowedFrom ? ticket.entryAllowedFrom.split('T')[0] : '',
        entryAllowedTo: ticket.entryAllowedTo ? ticket.entryAllowedTo.split('T')[0] : ''
      });
      setErrors(initialErrors);
    } else if (mode === 'create') {
      setFormData({
        tierName: '',
        basePrice: 0,
        entryAllowedFrom: '',
        entryAllowedTo: '',
        singleUse: false,
        singleDaily: false,
        tierPdfTemplateIrid: '',
        tierMailTemplateIrid: '',
        stockInitial: 0
      });
      setErrors(initialErrors);
    }
  }, [ticket, mode]);

  const validate = () => {
    const newErrors: {[key:string]: string} = {...initialErrors};
    if (!formData.tierName) newErrors.tierName = 'El nombre del tier es requerido';
    if (formData.basePrice < 0) newErrors.basePrice = 'El precio debe ser mayor o igual a 0';
    if (formData.stockInitial < 0) newErrors.stockInitial = 'El stock inicial debe ser mayor o igual a 0';
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && onSave) {
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

  const inputClass = (field: string) =>
    `w-full ${errors[field] ? 'border-red-500 focus:border-red-500' : ''}`;

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
                {mode === 'create' && 'Crear Tier de Ticket'}
                {mode === 'edit' && 'Editar Tier de Ticket'}
                {mode === 'view' && 'Ver Tier de Ticket'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Tier <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    className={inputClass('tierName')}
                    value={formData.tierName}
                    onChange={(e) => setFormData({...formData, tierName: e.target.value})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.tierName && <p className="text-red-500 text-xs mt-1">{errors.tierName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Precio Base <span className="text-red-500">*</span></label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className={inputClass('basePrice')}
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: Number(e.target.value)})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Entrada Permitida Desde</label>
                    <Input
                      type="datetime-local"
                      value={formData.entryAllowedFrom}
                      onChange={(e) => setFormData({...formData, entryAllowedFrom: e.target.value})}
                      disabled={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Entrada Permitida Hasta</label>
                    <Input
                      type="datetime-local"
                      value={formData.entryAllowedTo}
                      onChange={(e) => setFormData({...formData, entryAllowedTo: e.target.value})}
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.singleUse}
                        onChange={(e) => setFormData({...formData, singleUse: e.target.checked})}
                        disabled={isViewMode}
                      />
                      <span className="text-sm font-medium">Uso Único</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.singleDaily}
                        onChange={(e) => setFormData({...formData, singleDaily: e.target.checked})}
                        disabled={isViewMode}
                      />
                      <span className="text-sm font-medium">Uso Diario Único</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock Inicial <span className="text-red-500">*</span></label>
                  <Input
                    type="number"
                    min="0"
                    className={inputClass('stockInitial')}
                    value={formData.stockInitial}
                    onChange={(e) => setFormData({...formData, stockInitial: Number(e.target.value)})}
                    disabled={isViewMode}
                    required
                  />
                  {errors.stockInitial && <p className="text-red-500 text-xs mt-1">{errors.stockInitial}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Template PDF IRID</label>
                  <Input
                    type="text"
                    value={formData.tierPdfTemplateIrid}
                    onChange={(e) => setFormData({...formData, tierPdfTemplateIrid: e.target.value})}
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Template Email IRID</label>
                  <Input
                    type="text"
                    value={formData.tierMailTemplateIrid}
                    onChange={(e) => setFormData({...formData, tierMailTemplateIrid: e.target.value})}
                    disabled={isViewMode}
                  />
                </div>

                {mode === 'view' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock Actual</label>
                      <div className="text-sm text-gray-600">{formData.stockCurrent || 0}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock Vendido</label>
                      <div className="text-sm text-gray-600">{formData.stockSold || 0}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Evento</label>
                      <div className="text-sm text-gray-600">{formData.eventName || 'N/A'}</div>
                    </div>
                  </div>
                )}

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