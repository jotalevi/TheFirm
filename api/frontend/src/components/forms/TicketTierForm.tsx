"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { eventService } from '@/services/api';
import { Event } from '@/types';

// Interfaz simplificada para el formulario
interface TicketTierFormData {
  eventId: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

// Esquema de validación
const ticketTierSchema = yup.object({
  eventId: yup.number().required('Evento es requerido'),
  name: yup.string().required('Nombre es requerido'),
  price: yup.number().required('Precio es requerido').min(0, 'El precio debe ser positivo'),
  quantity: yup.number().required('Cantidad es requerida').min(1, 'La cantidad debe ser al menos 1'),
  description: yup.string().required('Descripción es requerida'),
});

interface TicketTierFormProps {
  ticketTier?: TicketTierFormData;
  onSubmit: (data: TicketTierFormData) => void;
  isLoading?: boolean;
  eventId?: number;
}

const TicketTierForm: React.FC<TicketTierFormProps> = ({ 
  ticketTier, 
  onSubmit, 
  isLoading = false,
  eventId: initialEventId 
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const defaultValues: TicketTierFormData = {
    eventId: initialEventId || 0,
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    ...ticketTier
  };

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TicketTierFormData>({
    resolver: yupResolver(ticketTierSchema),
    defaultValues
  });

  const selectedEventId = watch('eventId');

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const data = await eventService.getAll();
        setEvents(data.items || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = (value: string) => {
    setValue('eventId', parseInt(value, 10));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticketTier ? 'Editar Categoría de Ticket' : 'Crear Categoría de Ticket'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {!initialEventId && (
            <div className="space-y-2">
              <label htmlFor="event" className="text-sm font-medium">Evento</label>
              <Select 
                value={selectedEventId?.toString()} 
                onValueChange={handleEventChange}
                disabled={isLoadingEvents || !!initialEventId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar evento" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id?.toString() || ''}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventId && <p className="text-destructive text-sm">{errors.eventId.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Nombre de la Categoría</label>
            <Input
              id="name"
              placeholder="Ej: VIP, General, Premium"
              {...register('name')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Precio</label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1000"
                placeholder="Precio"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">Cantidad</label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Cantidad disponible"
                {...register('quantity', { valueAsNumber: true })}
              />
              {errors.quantity && <p className="text-destructive text-sm">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Descripción</label>
            <textarea
              id="description"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Descripción de la categoría de ticket"
              {...register('description')}
            />
            {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TicketTierForm; 