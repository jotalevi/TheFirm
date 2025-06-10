"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { companyService } from '@/services/api';
import { Company } from '@/types';

// Interfaz simplificada para el formulario
interface EventFormData {
  name: string;
  companyId: number;
  startDate: string;
  endDate: string;
  description: string;
  isPublic: boolean;
}

// Esquema de validación
const eventSchema = yup.object().shape({
  name: yup.string().required('Nombre es requerido'),
  companyId: yup.number().required('Empresa es requerida'),
  startDate: yup.string().required('Fecha inicio es requerida'),
  endDate: yup.string().required('Fecha fin es requerida'),
  description: yup.string().required('Descripción es requerida'),
  isPublic: yup.boolean().default(true).required()
});

interface EventFormProps {
  event?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, isLoading = false }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const defaultValues: EventFormData = {
    name: '',
    companyId: 0,
    startDate: '',
    endDate: '',
    description: '',
    isPublic: true,
    ...event
  };

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema) as any,
    defaultValues
  });

  const companyId = watch('companyId');

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const data = await companyService.getAll();
        setCompanies(data.items || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = (value: string) => {
    setValue('companyId', parseInt(value, 10));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event ? 'Editar Evento' : 'Crear Evento'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Nombre del Evento</label>
            <Input
              id="name"
              placeholder="Nombre del evento"
              {...register('name')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">Empresa</label>
            <Select 
              value={companyId?.toString()} 
              onValueChange={handleCompanyChange}
              disabled={isLoadingCompanies}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id?.toString() || ''}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.companyId && <p className="text-destructive text-sm">{errors.companyId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Fecha Inicio</label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
              {errors.startDate && <p className="text-destructive text-sm">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">Fecha Fin</label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
              />
              {errors.endDate && <p className="text-destructive text-sm">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Descripción</label>
            <textarea
              id="description"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Descripción del evento"
              {...register('description')}
            />
            {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('isPublic')}
            />
            <label htmlFor="isPublic" className="text-sm font-medium">
              Evento público
            </label>
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

export default EventForm; 